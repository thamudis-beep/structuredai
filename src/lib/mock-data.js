// Mock StructuredProduct — JP Morgan Autocallable on AAPL/MSFT/GOOGL
export const SAMPLE_PRODUCT = {
  productType: 'autocallable',
  issuer: 'J.P. Morgan',
  notional: 1000000,
  currency: 'USD',
  tradeDate: '2026-03-15',
  maturityDate: '2028-03-15',
  tenor: 24, // months

  underliers: [
    { ticker: 'AAPL', name: 'Apple Inc.', initialLevel: 227.50, weight: 0.333 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', initialLevel: 420.80, weight: 0.333 },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', initialLevel: 178.30, weight: 0.334 },
  ],

  coupon: {
    rate: 0.092,          // 9.2% p.a.
    frequency: 'quarterly',
    type: 'conditional',
    barrierLevel: 0.70,   // 70% of initial
    memory: true,
  },

  autocall: {
    enabled: true,
    startMonth: 6,        // first observation month 6
    frequency: 'quarterly',
    triggerLevel: 1.0,    // 100% of initial
    stepdown: 0.0,        // no stepdown
  },

  barrier: {
    level: 0.60,          // 60% of initial
    type: 'european',     // observed at maturity only
  },

  cap: null,              // no cap on autocallables

  // AI-generated content (filled by API, mocked here)
  summary: 'This 2-year autocallable note on a worst-of basket of AAPL, MSFT, and GOOGL offers a 9.2% annual contingent coupon with memory, paid quarterly if the worst-performing stock stays above 70% of its initial level. The note can be called early every quarter starting month 6 if all stocks are at or above their initial levels. At maturity, principal is protected unless the worst performer has fallen below the 60% European barrier.',

  sellingPoints: [
    'High 9.2% annual yield in a low-rate environment',
    'Memory feature recovers any missed coupon payments',
    'European barrier observed only at maturity — intraday dips don\'t trigger losses',
    '40% downside cushion before any principal loss',
    'Diversified blue-chip basket reduces single-stock risk',
  ],

  riskFactors: [
    'Worst-of feature: return driven by weakest stock in the basket',
    'Principal at risk if barrier breached at maturity — loss = stock decline',
    'No participation in upside beyond coupon payments',
    'Issuer credit risk (J.P. Morgan)',
    'Limited secondary market liquidity',
    'Autocall may shorten tenor, requiring reinvestment in potentially lower-rate environment',
  ],

  talkTrack: `This note pays you 2.3% every quarter — that's 9.2% annualized — as long as Apple, Microsoft, and Google all stay above 70% of where they started. If any stock dips below that, you skip the coupon but the memory feature means you'll collect all missed payments once they recover. Every quarter starting month 6, if all three stocks are at or above their starting price, the note gets called and you get your principal back plus any owed coupons. At the end of 2 years, you're fully protected unless the worst performer has dropped more than 40% — and that's only checked on the final day, not during the life. It's a strong income play on three of the most liquid names in the market, with meaningful downside protection.`,

  scenarios: [
    {
      name: 'bull',
      description: 'All stocks above initial at month 6',
      outcome: 'Autocalled at month 6. You receive $1,000,000 + $23,000 coupon (Q1) + $23,000 coupon (Q2) = $1,046,000. Annualized return: 9.2%.',
    },
    {
      name: 'base',
      description: 'Stocks fluctuate, worst-of stays above 70% through maturity',
      outcome: 'Full 8 quarterly coupons received. Total return: $1,000,000 + $184,000 = $1,184,000. Total return: 18.4% over 2 years.',
    },
    {
      name: 'bear',
      description: 'Worst performer ends at 75% (above 60% barrier)',
      outcome: 'Some coupons missed but recovered via memory. Principal returned in full at maturity. Return depends on recovery timing.',
    },
    {
      name: 'worst',
      description: 'Worst performer ends at 50% (below 60% barrier)',
      outcome: 'Barrier breached. You receive stock value: $1,000,000 × 50% = $500,000. Plus any coupons earned. Significant principal loss.',
    },
  ],

  howItWorks: [
    { step: 1, title: 'You invest', description: 'You invest $1,000,000 in the note issued by J.P. Morgan, linked to Apple, Microsoft, and Google.' },
    { step: 2, title: 'Earn quarterly income', description: 'Every quarter, if all three stocks are above 70% of their starting price, you earn a 2.3% coupon ($23,000). Missed? The memory feature catches you up later.' },
    { step: 3, title: 'Early exit possible', description: 'Starting month 6, if all stocks are at or above their starting price, the note is called early and you get your money back plus coupons.' },
    { step: 4, title: 'At maturity', description: 'After 2 years, if the worst stock is above 60% of its start, you get 100% of your investment back. Below 60%, your return matches that stock\'s performance.' },
  ],
};
