/**
 * Payoff functions for each product type from the JP Morgan brochure.
 * All take underlying return as decimal (-1 to +∞) and product params.
 * All return investor return as decimal (-1 = total loss, 0 = breakeven, +0.2 = 20% gain).
 */

// 1. Return Enhanced Note — leveraged upside to a cap, 1:1 downside
export function returnEnhancedNote(underlyingReturn, { leverage = 2, cap = 0.10 }) {
  if (underlyingReturn >= 0) {
    return Math.min(underlyingReturn * leverage, cap * leverage);
  }
  return underlyingReturn; // 1:1 downside
}

// 2. Market Protection Note — 1:1 upside to cap, 100% downside protection
export function marketProtectionNote(underlyingReturn, { cap = 0.07, protection = 1.0 }) {
  if (underlyingReturn >= 0) {
    return Math.min(underlyingReturn, cap);
  }
  // Protection: losses absorbed up to protection level
  const loss = Math.abs(underlyingReturn);
  if (loss <= protection) return 0;
  return -(loss - protection);
}

// 3. Buffered Return Enhanced Note — leveraged upside to cap, buffer, geared downside
export function bufferedReturnEnhanced(underlyingReturn, { leverage = 2, cap = 0.04, buffer = 0.10 }) {
  const maxReturn = cap * leverage;
  const gearing = 1 / (1 - buffer);
  if (underlyingReturn >= 0) {
    return Math.min(underlyingReturn * leverage, maxReturn);
  }
  const loss = Math.abs(underlyingReturn);
  if (loss <= buffer) return 0;
  return -((loss - buffer) * gearing);
}

// 4. Buffered Equity Note — 1:1 upside to cap, buffer, geared downside
export function bufferedEquityNote(underlyingReturn, { cap = 0.10, buffer = 0.10 }) {
  const gearing = 1 / (1 - buffer);
  if (underlyingReturn >= 0) {
    return Math.min(underlyingReturn, cap);
  }
  const loss = Math.abs(underlyingReturn);
  if (loss <= buffer) return 0;
  return -((loss - buffer) * gearing);
}

// 5. Dual Directional Buffered Note — absolute return in buffer zone, capped upside
export function dualDirectionalBuffered(underlyingReturn, { maxReturn = 0.10, buffer = 0.10 }) {
  const gearing = 1 / (1 - buffer);
  if (underlyingReturn >= 0) {
    return Math.min(underlyingReturn, maxReturn);
  }
  const loss = Math.abs(underlyingReturn);
  if (loss <= buffer) return loss; // positive absolute return
  return -((loss - buffer) * gearing);
}

// 6. Buffered Coupon Note — fixed coupon, buffer, geared downside
export function bufferedCouponNote(underlyingReturn, { coupon = 0.06, buffer = 0.15 }) {
  const gearing = 1 / (1 - buffer);
  if (underlyingReturn >= -buffer) {
    return coupon; // fixed coupon regardless of direction (within buffer)
  }
  const loss = Math.abs(underlyingReturn);
  return coupon - ((loss - buffer) * gearing);
}

// Generate chart data for a payoff function
export function generateIntroPayoffData(payoffFn, params, min = -0.5, max = 0.5, steps = 200) {
  const data = [];
  for (let i = 0; i <= steps; i++) {
    const ret = min + (max - min) * (i / steps);
    const noteReturn = payoffFn(ret, params);
    data.push({
      underlying: Math.round(ret * 1000) / 10,   // as percentage
      note: Math.round(noteReturn * 1000) / 10,   // as percentage
      directReturn: Math.round(ret * 1000) / 10,  // underlying (for comparison line)
    });
  }
  return data;
}

// Product type configs
export const PRODUCT_TYPES = [
  {
    id: 'returnEnhanced',
    category: 'growth',
    fn: returnEnhancedNote,
    defaults: { leverage: 2, cap: 0.10 },
    sliders: [
      { key: 'leverage', min: 1, max: 5, step: 0.5, format: 'x' },
      { key: 'cap', min: 0.03, max: 0.30, step: 0.01, format: '%' },
    ],
  },
  {
    id: 'marketProtection',
    category: 'protection',
    fn: marketProtectionNote,
    defaults: { cap: 0.07, protection: 1.0 },
    sliders: [
      { key: 'cap', min: 0.03, max: 0.30, step: 0.01, format: '%' },
      { key: 'protection', min: 0.5, max: 1.0, step: 0.05, format: '%' },
    ],
  },
  {
    id: 'bufferedReturnEnhanced',
    category: 'growth',
    fn: bufferedReturnEnhanced,
    defaults: { leverage: 2, cap: 0.04, buffer: 0.10 },
    sliders: [
      { key: 'leverage', min: 1, max: 5, step: 0.5, format: 'x' },
      { key: 'cap', min: 0.02, max: 0.20, step: 0.01, format: '%' },
      { key: 'buffer', min: 0.05, max: 0.30, step: 0.01, format: '%' },
    ],
  },
  {
    id: 'bufferedEquity',
    category: 'growth',
    fn: bufferedEquityNote,
    defaults: { cap: 0.10, buffer: 0.10 },
    sliders: [
      { key: 'cap', min: 0.03, max: 0.30, step: 0.01, format: '%' },
      { key: 'buffer', min: 0.05, max: 0.30, step: 0.01, format: '%' },
    ],
  },
  {
    id: 'dualDirectional',
    category: 'growth',
    fn: dualDirectionalBuffered,
    defaults: { maxReturn: 0.10, buffer: 0.10 },
    sliders: [
      { key: 'maxReturn', min: 0.05, max: 0.30, step: 0.01, format: '%' },
      { key: 'buffer', min: 0.05, max: 0.30, step: 0.01, format: '%' },
    ],
  },
  {
    id: 'bufferedCoupon',
    category: 'income',
    fn: bufferedCouponNote,
    defaults: { coupon: 0.06, buffer: 0.15 },
    sliders: [
      { key: 'coupon', min: 0.02, max: 0.15, step: 0.005, format: '%' },
      { key: 'buffer', min: 0.05, max: 0.30, step: 0.01, format: '%' },
    ],
  },
];
