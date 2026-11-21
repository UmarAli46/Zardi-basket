import { OrderItem } from '../types';
import { getProductById, getStoreSettings } from '../db';

/**
 * XSS & HTML Injection Sanitizer
 * Strips script tags, javascript: pseudo-protocols, HTML tags, and event handlers
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags
    .replace(/<[^>]+>/g, '') // remove any other HTML tags
    .replace(/javascript:/gi, '') // remove javascript: URI
    .replace(/on\w+\s*=/gi, '') // remove onload, onerror, onclick, etc.
    .trim();
}

/**
 * Validates Email Address with strict RFC regex
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

/**
 * Validates Pakistani Phone Numbers (e.g. 0300-1234567, 03211234567, +923001234567)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^(\+92|92|0)?3[0-9]{9}$/;
  return phoneRegex.test(cleaned);
}

export interface ValidatedCheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  breakageGuarantee: boolean;
  totalAmount: number;
  paymentMethod: 'safepay' | 'jazzcash_tid' | 'easypaisa_tid' | 'cod';
  paymentReference: string;
  batchTraceabilityCode: string;
}

/**
 * Server-Side Cart & Checkout Security Verifier
 * Prevents:
 * 1. Price tampering (client altering product price)
 * 2. Negative or zero quantities
 * 3. Out-of-stock purchases
 * 4. Invalid delivery fees or free-delivery bypass
 */
export async function validateAndCalculateCheckout(payload: any): Promise<{
  valid: boolean;
  error?: string;
  order?: ValidatedCheckoutPayload;
}> {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Malformed request payload' };
  }

  const customerName = sanitizeString(payload.customerName);
  if (!customerName || customerName.length < 2 || customerName.length > 100) {
    return { valid: false, error: 'Customer name must be between 2 and 100 characters' };
  }

  const customerEmail = sanitizeString(payload.customerEmail);
  if (!isValidEmail(customerEmail)) {
    return { valid: false, error: 'Invalid email address provided' };
  }

  const customerPhone = sanitizeString(payload.customerPhone);
  if (!isValidPhone(customerPhone)) {
    return { valid: false, error: 'Please enter a valid Pakistani mobile number (e.g. 0300-1234567)' };
  }

  const deliveryAddress = sanitizeString(payload.deliveryAddress);
  if (!deliveryAddress || deliveryAddress.length < 5 || deliveryAddress.length > 250) {
    return { valid: false, error: 'Delivery address must be between 5 and 250 characters' };
  }

  const rawCity = sanitizeString(payload.deliveryCity) || 'Karachi';
  const SINDH_REGIONS = [
    'karachi',
    'hyderabad',
    'sukkur',
    'larkana',
    'mirpurkhas',
    'nawabshah',
    'shaheed benazirabad',
    'thatta',
    'badin',
    'dadu',
    'jamshoro',
    'shikarpur',
    'jacobabad',
    'khairpur',
    'tando allahyar',
    'tando muhammad khan',
    'umerkot',
    'sanghar',
    'ghotki',
    'kashmore',
    'matiari',
    'kambar',
    'shahdadkot',
    'naushahro feroze',
    'sujawal',
    'kotri',
    'sindh',
  ];
  const cityLower = rawCity.toLowerCase();
  const isSindh = SINDH_REGIONS.some((region) => cityLower.includes(region));
  if (!isSindh) {
    return {
      valid: false,
      error: 'Delivery service is exclusively available within Sindh province (Karachi, Hyderabad, Sukkur, Thatta, etc.). Orders outside Sindh are not accepted.',
    };
  }
  const deliveryCity = rawCity;
  const deliveryNotes = sanitizeString(payload.deliveryNotes || '');

  const paymentMethod = payload.paymentMethod;
  if (!['safepay', 'jazzcash_tid', 'easypaisa_tid', 'cod'].includes(paymentMethod)) {
    return { valid: false, error: 'Invalid payment method selected' };
  }

  const paymentReference = sanitizeString(payload.paymentReference || '');
  if ((paymentMethod === 'jazzcash_tid' || paymentMethod === 'easypaisa_tid') && !paymentReference) {
    return { valid: false, error: 'Please enter your 10-digit transaction ID (TID)' };
  }

  // Validate Items
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }

  const settings = await getStoreSettings();
  let verifiedSubtotal = 0;
  const verifiedItems: OrderItem[] = [];
  let primaryBatchCode = 'ZB-FARM-FRESH';

  for (const rawItem of payload.items) {
    const productId = sanitizeString(rawItem.productId);
    const packagingId = rawItem.packagingId;
    const quantity = Math.floor(Number(rawItem.quantity));

    if (!['6pack', '12pack', '30tray'].includes(packagingId)) {
      return { valid: false, error: `Invalid packaging option for item: ${rawItem.title}` };
    }

    if (isNaN(quantity) || quantity <= 0 || quantity > 50) {
      return { valid: false, error: 'Quantity must be a positive number between 1 and 50' };
    }

    const product = await getProductById(productId);
    if (!product || !product.isActive) {
      return { valid: false, error: `Product not available or out of stock: ${rawItem.title}` };
    }

    if (product.batchCode) {
      primaryBatchCode = product.batchCode;
    }

    // Determine actual authoritative price from Database (DO NOT TRUST CLIENT)
    let unitPrice = product.price12Pack;
    let label = '12-Pack Carton';

    if (packagingId === '6pack') {
      unitPrice = product.price6Pack;
      label = '6-Pack Carton';
    } else if (packagingId === '30tray') {
      unitPrice = product.price30Tray;
      label = '30-Egg Flat / Tray';
    }

    const lineTotal = unitPrice * quantity;
    verifiedSubtotal += lineTotal;

    verifiedItems.push({
      productId: product.id,
      title: product.title,
      packagingId: packagingId as '6pack' | '12pack' | '30tray',
      packagingLabel: label,
      quantity,
      unitPrice,
      lineTotal,
    });
  }

  // Delivery Fee calculation
  const deliveryFee = verifiedSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge;

  // Breakage guarantee calculation
  const breakageGuarantee = Boolean(payload.breakageGuarantee);
  const guaranteeFee = breakageGuarantee ? settings.breakageGuaranteeFee : 0;

  // True Server-Side Total
  const verifiedTotal = verifiedSubtotal + deliveryFee + guaranteeFee;

  return {
    valid: true,
    order: {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryNotes,
      items: verifiedItems,
      subtotal: verifiedSubtotal,
      deliveryFee,
      breakageGuarantee,
      totalAmount: verifiedTotal,
      paymentMethod,
      paymentReference,
      batchTraceabilityCode: primaryBatchCode,
    },
  };
}
