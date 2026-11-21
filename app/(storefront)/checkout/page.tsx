'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  TextField,
  MenuItem,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCartStore } from '@/lib/store/useCartStore';

const SINDH_CITIES = [
  'Karachi',
  'Hyderabad',
  'Sukkur',
  'Larkana',
  'Mirpurkhas',
  'Nawabshah (Shaheed Benazirabad)',
  'Thatta',
  'Badin',
  'Dadu',
  'Jamshoro',
  'Shikarpur',
  'Jacobabad',
  'Khairpur',
  'Tando Allahyar',
  'Tando Muhammad Khan',
  'Umerkot',
  'Sanghar',
  'Ghotki',
  'Kashmore',
  'Matiari',
  'Kambar Shahdadkot',
  'Naushahro Feroze',
  'Sujawal',
  'Kotri',
  'Other Sindh District',
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const breakageGuarantee = useCartStore((state) => state.breakageGuarantee);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const clearCart = useCartStore((state) => state.clearCart);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Karachi');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'safepay' | 'jazzcash_tid' | 'easypaisa_tid' | 'cod'>('cod');
  const [paymentReference, setPaymentReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const totalAmount = getTotalAmount();

  if (items.length === 0) {
    return (
      <Box sx={{ py: 12, textAlign: 'center', backgroundColor: '#FAF7F2', minHeight: '75vh' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
            Your basket is empty.
          </Typography>
          <Button component={Link} href="/shop" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
            Return to Egg Catalog
          </Button>
        </Container>
      </Box>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!SINDH_CITIES.includes(deliveryCity)) {
        setErrorMsg('Delivery is strictly restricted to Sindh province (Karachi, Hyderabad, Sukkur, Thatta, etc.). Deliveries to other provinces are currently unavailable.');
        setLoading(false);
        return;
      }

      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryCity,
        deliveryNotes,
        paymentMethod,
        paymentReference,
        breakageGuarantee,
        items: items.map((it) => ({
          productId: it.productId,
          title: it.title,
          packagingId: it.packagingId,
          quantity: it.quantity,
        })),
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please check your details.');
      }

      // If Safepay payment is selected and has redirect url or token
      if (paymentMethod === 'safepay' && data.safepayUrl) {
        clearCart();
        window.location.href = data.safepayUrl;
        return;
      }

      // Standard Order Complete (COD or Manual TID)
      clearCart();
      router.push(`/order-success?id=${data.order.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6, backgroundColor: '#FAF7F2', minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Back Link */}
        <Box sx={{ mb: 3 }}>
          <Button component={Link} href="/cart" startIcon={<ArrowBackIcon />} sx={{ color: '#1E3A2F', fontWeight: 700 }}>
            Back to Basket
          </Button>
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E3A2F', mb: 1 }}>
          Checkout &amp; Cold-Chain Delivery
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          Enter your delivery destination and select your payment method.
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmitOrder}>
          <Grid container spacing={4}>
            {/* Left Column: Form Details */}
            <Grid item xs={12} md={7}>
              {/* Step 1: Customer Contact Info */}
              <Card sx={{ p: 3.5, mb: 3, borderRadius: 4, border: '1px solid #E5DFD5' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                  1. Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Full Name"
                      fullWidth
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      type="email"
                      placeholder="ua46846@gmail.com"
                      fullWidth
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Pakistani Mobile Number"
                      placeholder="0300-1234567"
                      fullWidth
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Step 2: Delivery Destination */}
              <Card sx={{ p: 3.5, mb: 3, borderRadius: 4, border: '1px solid #E5DFD5' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                  2. Delivery Destination
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Delivery City (Sindh Only)"
                      fullWidth
                      required
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                    >
                      {SINDH_CITIES.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Province"
                      fullWidth
                      disabled
                      value="Sindh (Exclusive Delivery)"
                      helperText="Express cold-chain transit across Sindh only"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Complete Street Address (House/Apt, Block, Sector)"
                      placeholder="e.g. IMCS Department ,University of Sindh."
                      fullWidth
                      required
                      multiline
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Special Delivery Instructions (Optional)"
                      placeholder="e.g. Leave with security guard in cooler bag"
                      fullWidth
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Step 3: Payment Method */}
              <Card sx={{ p: 3.5, borderRadius: 4, border: '1px solid #E5DFD5' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                  3. Select Payment Method
                </Typography>

                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  {/* Option 1: Cash on Delivery */}
                  <Box
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: paymentMethod === 'cod' ? '#1E3A2F' : '#E5DFD5',
                      backgroundColor: paymentMethod === 'cod' ? 'rgba(30, 58, 47, 0.04)' : '#FFFFFF',
                    }}
                  >
                    <FormControlLabel
                      value="cod"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalAtmIcon sx={{ color: '#2E7D32' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                            Cash on Delivery (COD)
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', pl: 4 }}>
                      Pay in cash or online transfer directly when the courier brings your fresh carton.
                    </Typography>
                  </Box>

                  {/* Option 2: Safepay Sandbox (Debit/Credit Card & Easypaisa) */}
                  <Box
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: paymentMethod === 'safepay' ? '#1E3A2F' : '#E5DFD5',
                      backgroundColor: paymentMethod === 'safepay' ? 'rgba(30, 58, 47, 0.04)' : '#FFFFFF',
                    }}
                  >
                    <FormControlLabel
                      value="safepay"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CreditCardIcon sx={{ color: '#1E3A2F' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                            Safepay Sandbox (Visa, Mastercard, Easypaisa)
                          </Typography>
                          <Chip label="Sandbox API" size="small" sx={{ fontWeight: 700, height: 20 }} />
                        </Box>
                      }
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', pl: 4 }}>
                      Instant secure checkout with sandbox test cards or simulated wallet accounts.
                    </Typography>
                  </Box>

                  {/* Option 3: JazzCash / Easypaisa Manual TID */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: paymentMethod === 'jazzcash_tid' ? '#1E3A2F' : '#E5DFD5',
                      backgroundColor: paymentMethod === 'jazzcash_tid' ? 'rgba(30, 58, 47, 0.04)' : '#FFFFFF',
                    }}
                  >
                    <FormControlLabel
                      value="jazzcash_tid"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIphoneIcon sx={{ color: '#E8981A' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E3A2F' }}>
                            JazzCash / Easypaisa (Direct Mobile Wallet &amp; TID)
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', pl: 4 }}>
                      Send payment to our official merchant account and paste your Transaction ID (TID) below.
                    </Typography>

                    {paymentMethod === 'jazzcash_tid' && (
                      <Box sx={{ mt: 2, pl: 4 }}>
                        <Card sx={{ p: 2, mb: 2, backgroundColor: '#FAF7F2', borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E3A2F', display: 'block' }}>
                            Merchant Title: Zardi Basket Farms Pvt. Ltd.
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#DF1B25', fontWeight: 800, display: 'block' }}>
                            • JazzCash Till: 0300-8492011
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#00A651', fontWeight: 800, display: 'block' }}>
                            • Easypaisa Account: 0345-8492011
                          </Typography>
                        </Card>

                        <TextField
                          label="Enter 10-Digit Transaction ID (TID)"
                          placeholder="e.g. 8492011982"
                          size="small"
                          fullWidth
                          required
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                        />
                      </Box>
                    )}
                  </Box>
                </RadioGroup>
              </Card>
            </Grid>

            {/* Right Column: Order Summary & Confirm Button */}
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3.5, borderRadius: 4, border: '1px solid #E5DFD5', backgroundColor: '#FFFFFF', position: 'sticky', top: 100 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E3A2F', mb: 2 }}>
                  Order Summary
                </Typography>

                {/* Items preview */}
                <Box sx={{ maxHeight: 240, overflowY: 'auto', mb: 2 }}>
                  {items.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#E8981A', fontWeight: 700 }}>
                          {item.quantity}x {item.packagingLabel}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                        Rs. {item.unitPrice * item.quantity}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                    Rs. {subtotal}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Insulated Cold-Chain Delivery
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: deliveryFee === 0 ? '#2E7D32' : '#1E3A2F' }}>
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                  </Typography>
                </Box>
                {breakageGuarantee && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Zero-Breakage Shield
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A2F' }}>
                      Rs. 80
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E3A2F' }}>
                    Total Payable
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#E8981A' }}>
                    Rs. {totalAmount}
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOutlinedIcon />}
                  sx={{
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    backgroundColor: '#1E3A2F',
                    '&:hover': { backgroundColor: '#13261F' },
                  }}
                >
                  {loading ? 'Processing Harvest Order...' : `Place Fresh Order • Rs. ${totalAmount}`}
                </Button>

                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', mt: 2 }}>
                  🔒 256-Bit SSL Encrypted &amp; Inspected Batch Dispatch
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
}
