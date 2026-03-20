/**
 * Payoff engine — pure functions that compute investor return
 * given product parameters and an underlying price level.
 *
 * All price levels expressed as fraction of initial (1.0 = 100%).
 * Returns are on notional (1.0 = 100% of principal).
 */

/**
 * Calculate total coupon return for the product's full tenor.
 * @param {object} product - StructuredProduct
 * @param {number} worstLevel - worst-of underlying as fraction of initial
 * @returns {number} total coupon as fraction of notional
 */
export function calcCouponReturn(product, worstLevel) {
  const { coupon, tenor } = product;
  const periods = getPeriods(coupon.frequency, tenor);

  if (coupon.type === 'fixed') {
    // Fixed coupon always pays
    return coupon.rate * (tenor / 12);
  }

  if (coupon.type === 'conditional') {
    // Simplified: assume worst-of stays at worstLevel for entire tenor
    if (worstLevel >= coupon.barrierLevel) {
      return coupon.rate * (tenor / 12);
    }
    if (coupon.memory) {
      // Memory: if it recovers above barrier at maturity, all coupons paid
      // For static payoff diagram, treat as: above barrier = all, below = 0
      return 0;
    }
    return 0;
  }

  return 0;
}

/**
 * Calculate principal return at maturity (1.0 = full principal).
 * @param {object} product
 * @param {number} worstLevel - worst-of underlying as fraction of initial
 * @returns {number} principal returned as fraction of notional
 */
export function calcPrincipalReturn(product, worstLevel) {
  const { barrier, cap, productType } = product;

  // Check barrier breach
  const barrierBreached = worstLevel < barrier.level;

  if (!barrierBreached) {
    // Principal protected — return 100%
    return 1.0;
  }

  // Barrier breached — loss = worst performer decline
  // Principal return = worstLevel (e.g., 50% level → get back 50%)
  return worstLevel;
}

/**
 * Total investor return (principal + coupons) as fraction of notional.
 * @param {object} product
 * @param {number} worstLevel - worst-of underlying as fraction of initial (0 to 2+)
 * @returns {{ total: number, principal: number, coupon: number }}
 */
export function calcTotalReturn(product, worstLevel) {
  const principal = calcPrincipalReturn(product, worstLevel);
  const coupon = calcCouponReturn(product, worstLevel);
  return {
    total: principal + coupon,
    principal,
    coupon,
  };
}

/**
 * Generate payoff curve data points for charting.
 * @param {object} product
 * @param {number} [minLevel=0] - minimum underlying level
 * @param {number} [maxLevel=2.0] - maximum underlying level
 * @param {number} [steps=200] - number of data points
 * @returns {Array<{ level: number, total: number, principal: number, coupon: number }>}
 */
export function generatePayoffCurve(product, minLevel = 0, maxLevel = 2.0, steps = 200) {
  const data = [];
  for (let i = 0; i <= steps; i++) {
    const level = minLevel + (maxLevel - minLevel) * (i / steps);
    const result = calcTotalReturn(product, level);
    data.push({
      level: Math.round(level * 1000) / 10, // as percentage (0–200)
      total: Math.round(result.total * 1000) / 10,
      principal: Math.round(result.principal * 1000) / 10,
      coupon: Math.round(result.coupon * 1000) / 10,
    });
  }
  return data;
}

/** Helper: number of coupon periods */
function getPeriods(frequency, tenorMonths) {
  switch (frequency) {
    case 'monthly': return tenorMonths;
    case 'quarterly': return Math.floor(tenorMonths / 3);
    case 'semiannual': return Math.floor(tenorMonths / 6);
    case 'annual': return Math.floor(tenorMonths / 12);
    case 'atMaturity': return 1;
    default: return Math.floor(tenorMonths / 3);
  }
}
