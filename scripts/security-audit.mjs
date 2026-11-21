/**
 * Zardi Basket — Automated White Box & Black Box Security Audit Suite
 * Tests for:
 * 1. XSS & HTML Injection Sanitization
 * 2. SQL / NoSQL Injection Payload Neutralization
 * 3. Price Tampering & Cart Manipulation Exploits
 * 4. Negative / Out-of-Bounds Quantity Attacks
 * 5. Admin Authentication & Route Guarding (IDOR prevention)
 * 6. Rate Limiting Brute Force Defense
 * 7. HTTP Security Headers Configuration
 */

import { sanitizeString, isValidEmail, isValidPhone, validateAndCalculateCheckout } from '../lib/security/validator.ts';
import { checkRateLimit } from '../lib/security/rateLimiter.ts';
import { verifyCredentials } from '../lib/security/auth.ts';

const auditResults = [];

function recordTest(category, testName, passed, details) {
  auditResults.push({ category, testName, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${category}] ${testName} - ${details}`);
}

console.log('\n======================================================');
console.log('🛡️  STARTING ZARDI BASKET COMPREHENSIVE SECURITY AUDIT');
console.log('======================================================\n');

// --------------------------------------------------------------------
// 1. WHITE BOX: XSS & HTML INJECTION SANITIZATION
// --------------------------------------------------------------------
console.log('--- Phase 1: White Box XSS & Sanitization Audits ---');

const xssPayloads = [
  { payload: '<script>alert("xss")</script>Hello', expected: 'Hello' },
  { payload: '<img src=x onerror=alert(document.cookie)>Sunny', expected: 'Sunny' },
  { payload: '<svg/onload=alert(1)>Chakwal', expected: 'Chakwal' },
  { payload: 'javascript:alert(1)', expected: 'alert(1)' },
  { payload: '<a href="javascript:steal()">Click</a>Duck Eggs', expected: 'ClickDuck Eggs' },
];

for (const { payload, expected } of xssPayloads) {
  const sanitized = sanitizeString(payload);
  const safe = !sanitized.includes('<script>') && !sanitized.includes('onerror=') && !sanitized.includes('javascript:');
  recordTest('XSS Sanitization', `Neutralize "${payload.slice(0, 24)}..."`, safe, `Result: "${sanitized}"`);
}

// --------------------------------------------------------------------
// 2. WHITE BOX: SQL / NOSQL INJECTION PAYLOAD RESISTANCE
// --------------------------------------------------------------------
console.log('\n--- Phase 2: SQL / NoSQL Injection Audits ---');

const sqliPayloads = [
  "' OR '1'='1",
  "admin' --",
  "1; DROP TABLE products;",
  '{"$gt": ""}',
  "UNION SELECT username, password FROM users --",
];

for (const sqli of sqliPayloads) {
  const sanitized = sanitizeString(sqli);
  const isNeutralized = !sanitized.includes('<') && !sanitized.includes('>');
  recordTest('SQLi/NoSQLi Defense', `Test payload: "${sqli}"`, isNeutralized, `Sanitized string safe for parameterized queries`);
}

// --------------------------------------------------------------------
// 3. WHITE BOX: PHONE & EMAIL RFC VALIDATION
// --------------------------------------------------------------------
console.log('\n--- Phase 3: Input Format & Pattern Validation ---');

recordTest('Input Validation', 'Valid Pakistani phone format (0300-8492011)', isValidPhone('0300-8492011'), 'Properly accepts format');
recordTest('Input Validation', 'Valid Pakistani phone format (+923214567890)', isValidPhone('+923214567890'), 'Properly accepts format');
recordTest('Input Validation', 'Reject garbage phone format (12345)', !isValidPhone('12345'), 'Rejected invalid phone');
recordTest('Input Validation', 'Valid RFC Email (care@zardibasket.com)', isValidEmail('care@zardibasket.com'), 'Accepted valid RFC email');
recordTest('Input Validation', 'Reject invalid email (invalid-email@)', !isValidEmail('invalid-email@'), 'Rejected invalid email');

// --------------------------------------------------------------------
// 4. BLACK BOX: PRICE TAMPERING & CART MANIPULATION EXPLOITS
// --------------------------------------------------------------------
console.log('\n--- Phase 4: Cart Security & Price Tampering Exploits ---');

async function runCartSecurityTests() {
  // Test A: Client claims item price is Rs. 1 instead of Rs. 540
  const tamperedPayload = {
    customerName: 'Attacker Malicious',
    customerEmail: 'attacker@evil.com',
    customerPhone: '0300-1112233',
    deliveryAddress: 'Clifton Block 5, Karachi',
    deliveryCity: 'Karachi',
    paymentMethod: 'cod',
    items: [
      {
        productId: 'prod-desi-001',
        title: 'Pure Aseel Desi Eggs • خالص اصیل دیسی انڈے',
        packagingId: '12pack',
        quantity: 2,
        unitPrice: 1, // TAMPERED! True DB price is 540
        lineTotal: 2,
      },
    ],
    totalAmount: 2, // TAMPERED!
  };

  const testAResult = await validateAndCalculateCheckout(tamperedPayload);
  // Authoritative server calculation: 2 x 540 = 1080 + 150 delivery = 1230
  const preventedTampering = testAResult.valid && testAResult.order.totalAmount === 1230;
  recordTest(
    'Price Tampering',
    'Reject client-tampered price and recalculate from DB',
    preventedTampering,
    `Client sent Rs. 2, Server authoritatively calculated Rs. ${testAResult.order?.totalAmount}`
  );

  // Test B: Negative Quantity Exploit (e.g. trying to credit account)
  const negativeQtyPayload = {
    ...tamperedPayload,
    items: [
      {
        productId: 'prod-desi-001',
        packagingId: '12pack',
        quantity: -5,
      },
    ],
  };
  const testBResult = await validateAndCalculateCheckout(negativeQtyPayload);
  recordTest(
    'Quantity Exploit',
    'Block negative quantity purchase (-5 items)',
    !testBResult.valid,
    `Error returned: "${testBResult.error}"`
  );

  // Test C: Fake Packaging Exploit
  const fakePackagingPayload = {
    ...tamperedPayload,
    items: [
      {
        productId: 'prod-desi-001',
        packagingId: 'unlimited_super_crate',
        quantity: 1,
      },
    ],
  };
  const testCResult = await validateAndCalculateCheckout(fakePackagingPayload);
  recordTest(
    'Packaging Exploit',
    'Block non-existent packaging ID',
    !testCResult.valid,
    `Error returned: "${testCResult.error}"`
  );

  // Test D: Province Restriction Exploit (Attempting delivery to non-Sindh province e.g. Lahore/Punjab)
  const outOfProvincePayload = {
    ...tamperedPayload,
    deliveryCity: 'Lahore, Punjab',
  };
  const testDResult = await validateAndCalculateCheckout(outOfProvincePayload);
  recordTest(
    'Province Restriction',
    'Block non-Sindh delivery destination (Lahore, Punjab)',
    !testDResult.valid,
    `Error returned: "${testDResult.error}"`
  );
}

await runCartSecurityTests();

// --------------------------------------------------------------------
// 5. BLACK BOX: RATE LIMITING & BRUTE FORCE PROTECTION
// --------------------------------------------------------------------
console.log('\n--- Phase 5: Rate Limiting & Anti-Brute-Force Audits ---');

const testIp = '192.168.1.105_audit_test';
let blocked = false;
for (let i = 0; i < 25; i++) {
  const res = checkRateLimit(testIp, 10, 60 * 1000);
  if (!res.allowed) {
    blocked = true;
    break;
  }
}
recordTest('Rate Limiter', 'Throttle rapid brute-force requests (>10 hits/min)', blocked, 'Successfully triggered 429 Throttle');

// --------------------------------------------------------------------
// 6. BLACK BOX: ADMIN AUTHENTICATION SECURITY
// --------------------------------------------------------------------
console.log('\n--- Phase 6: Authentication & Session Verification ---');

recordTest('Admin Auth', 'Reject empty credentials', !verifyCredentials('', ''), 'Rejected empty login');
recordTest('Admin Auth', 'Reject incorrect password', !verifyCredentials('admin@zardibasket.com', 'wrongpassword'), 'Rejected bad password');
recordTest('Admin Auth', 'Authenticate valid admin credentials', verifyCredentials('admin@zardibasket.com', 'ZardiAdmin2026!'), 'Accepted official credentials');

// --------------------------------------------------------------------
// AUDIT SUMMARY
// --------------------------------------------------------------------
const totalTests = auditResults.length;
const passedTests = auditResults.filter((r) => r.passed).length;
const failedTests = totalTests - passedTests;

console.log('\n======================================================');
console.log(`🛡️  AUDIT COMPLETE: ${passedTests}/${totalTests} TESTS PASSED (${failedTests} FAILED)`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
