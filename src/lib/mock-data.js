// Sample StructuredProduct — Morgan Stanley Autocallable on META/AMZN/NVDA (worst-of)
export const SAMPLE_PRODUCT = {
  productType: 'autocallable',
  issuer: 'Morgan Stanley',
  notional: 1000000,
  currency: 'USD',
  tradeDate: '2026-03-15',
  maturityDate: '2028-03-15',
  tenor: 24, // months

  underliers: [
    { ticker: 'META', name: 'Meta Platforms', initialLevel: 585.20, weight: 0.333 },
    { ticker: 'AMZN', name: 'Amazon.com', initialLevel: 198.40, weight: 0.333 },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', initialLevel: 124.80, weight: 0.334 },
  ],

  coupon: {
    rate: 0.108,          // 10.8% p.a.
    frequency: 'quarterly',
    type: 'conditional',
    barrierLevel: 0.65,   // 65% of initial
    memory: true,
  },

  autocall: {
    enabled: true,
    startMonth: 6,
    frequency: 'quarterly',
    triggerLevel: 1.0,
    stepdown: 0.0,
  },

  barrier: {
    level: 0.55,          // 55% of initial — 45% downside protection
    type: 'european',
  },

  cap: null,

  summary: 'This 2-year autocallable note on a worst-of basket of META, AMZN, and NVDA offers a 10.8% annual contingent coupon with memory, paid quarterly if the worst-performing stock stays above 65% of its initial level. The note can be called early every quarter starting month 6 if all stocks are at or above their initial levels. At maturity, principal is protected unless the worst performer has fallen below the 55% European barrier — providing 45% downside cushion.',

  sellingPoints: [
    'Premium 10.8% annual yield on high-conviction mega-cap tech names',
    'Memory feature recovers any missed coupon payments when stocks rebound',
    'European barrier observed only at maturity — intraday volatility doesn\'t trigger losses',
    '45% downside cushion before any principal loss',
    'Three of the highest-revenue AI companies in the world — META, AMZN, NVDA',
  ],

  riskFactors: [
    'Worst-of feature: return driven by the weakest stock in the basket',
    'Principal at risk if barrier breached at maturity — loss tracks the worst performer',
    'No participation in stock upside beyond coupon payments',
    'Issuer credit risk (Morgan Stanley)',
    'Limited secondary market liquidity — designed to hold to maturity',
    'Autocall may shorten tenor, forcing reinvestment in a potentially lower-rate environment',
  ],

  talkTrack: `This note pays you 2.7% every quarter — that's 10.8% annualized — as long as Meta, Amazon, and NVIDIA all stay above 65% of where they started. Miss a coupon? The memory feature means you collect everything owed once they recover. Every quarter starting month 6, if all three are at or above their starting price, you get your principal back plus any owed coupons. At maturity, you're fully protected unless the worst of the three has dropped more than 45% — and that's only checked on the final day. You're getting a double-digit yield on three of the biggest AI beneficiaries in the market, with nearly half the downside protected.`,

  scenarios: [
    {
      name: 'bull',
      description: 'All stocks above initial at month 6',
      outcome: 'Autocalled at month 6. You receive $1,000,000 + $27,000 coupon (Q1) + $27,000 coupon (Q2) = $1,054,000. Annualized return: 10.8%.',
    },
    {
      name: 'base',
      description: 'Stocks fluctuate, worst-of stays above 65% through maturity',
      outcome: 'Full 8 quarterly coupons received. Total return: $1,000,000 + $216,000 = $1,216,000. Total return: 21.6% over 2 years.',
    },
    {
      name: 'bear',
      description: 'Worst performer ends at 70% (above 55% barrier)',
      outcome: 'Some coupons missed but recovered via memory. Principal returned in full at maturity. Return depends on recovery timing.',
    },
    {
      name: 'worst',
      description: 'Worst performer ends at 45% (below 55% barrier)',
      outcome: 'Barrier breached. You receive stock value: $1,000,000 x 45% = $450,000. Plus any coupons earned. Significant principal loss.',
    },
  ],

  howItWorks: {
    en: [
      { step: 1, title: 'You invest', description: 'You invest $1,000,000 in the note issued by Morgan Stanley, linked to Meta, Amazon, and NVIDIA.' },
      { step: 2, title: 'Earn quarterly income', description: 'Every quarter, if all three stocks are above 65% of their starting price, you earn a 2.7% coupon ($27,000). Missed? The memory feature catches you up later.' },
      { step: 3, title: 'Early exit possible', description: 'Starting month 6, if all stocks are at or above their starting price, the note is called early and you get your money back plus coupons.' },
      { step: 4, title: 'At maturity', description: 'After 2 years, if the worst stock is above 55% of its start, you get 100% of your investment back. Below 55%, your return matches that stock\'s performance.' },
    ],
    es: [
      { step: 1, title: 'Usted invierte', description: 'Invierte $1,000,000 en la nota emitida por Morgan Stanley, vinculada a Meta, Amazon y NVIDIA.' },
      { step: 2, title: 'Ingreso trimestral', description: 'Cada trimestre, si las tres acciones están por encima del 65% de su precio inicial, usted gana un cupón del 2.7% ($27,000). ¿Se perdió uno? La memoria lo recupera después.' },
      { step: 3, title: 'Salida anticipada posible', description: 'A partir del mes 6, si todas las acciones están al nivel o por encima de su precio inicial, la nota se cancela anticipadamente y usted recupera su dinero más los cupones.' },
      { step: 4, title: 'Al vencimiento', description: 'Después de 2 años, si la peor acción está por encima del 55% de su inicio, recupera el 100% de su inversión. Por debajo del 55%, su retorno iguala el desempeño de esa acción.' },
    ],
  },

  scenarios: {
    en: [
      { name: 'bull', description: 'All stocks above initial at month 6', outcome: 'Autocalled at month 6. You receive $1,000,000 + $27,000 coupon (Q1) + $27,000 coupon (Q2) = $1,054,000. Annualized return: 10.8%.' },
      { name: 'base', description: 'Stocks fluctuate, worst-of stays above 65% through maturity', outcome: 'Full 8 quarterly coupons received. Total return: $1,000,000 + $216,000 = $1,216,000. Total return: 21.6% over 2 years.' },
      { name: 'bear', description: 'Worst performer ends at 70% (above 55% barrier)', outcome: 'Some coupons missed but recovered via memory. Principal returned in full at maturity. Return depends on recovery timing.' },
      { name: 'worst', description: 'Worst performer ends at 45% (below 55% barrier)', outcome: 'Barrier breached. You receive stock value: $1,000,000 x 45% = $450,000. Plus any coupons earned. Significant principal loss.' },
    ],
    es: [
      { name: 'bull', description: 'Todas las acciones por encima del nivel inicial en el mes 6', outcome: 'Autocall en el mes 6. Recibe $1,000,000 + $27,000 cupón (T1) + $27,000 cupón (T2) = $1,054,000. Retorno anualizado: 10.8%.' },
      { name: 'base', description: 'Las acciones fluctúan, el peor desempeño se mantiene sobre 65% hasta el vencimiento', outcome: '8 cupones trimestrales recibidos. Retorno total: $1,000,000 + $216,000 = $1,216,000. Retorno total: 21.6% en 2 años.' },
      { name: 'bear', description: 'El peor desempeño termina en 70% (por encima de la barrera del 55%)', outcome: 'Algunos cupones perdidos pero recuperados con la memoria. Capital devuelto completo al vencimiento. El retorno depende del momento de recuperación.' },
      { name: 'worst', description: 'El peor desempeño termina en 45% (por debajo de la barrera del 55%)', outcome: 'Barrera vulnerada. Recibe valor de la acción: $1,000,000 x 45% = $450,000. Más cupones ganados. Pérdida significativa de capital.' },
    ],
  },

  summary: {
    en: 'This 2-year autocallable note on a worst-of basket of META, AMZN, and NVDA offers a 10.8% annual contingent coupon with memory, paid quarterly if the worst-performing stock stays above 65% of its initial level. The note can be called early every quarter starting month 6 if all stocks are at or above their initial levels. At maturity, principal is protected unless the worst performer has fallen below the 55% European barrier — providing 45% downside cushion.',
    es: 'Esta nota autocallable a 2 años sobre una canasta worst-of de META, AMZN y NVDA ofrece un cupón contingente anual del 10.8% con memoria, pagado trimestralmente si la acción con peor desempeño se mantiene por encima del 65% de su nivel inicial. La nota puede cancelarse anticipadamente cada trimestre a partir del mes 6 si todas las acciones están al nivel o por encima de sus niveles iniciales. Al vencimiento, el capital está protegido a menos que el peor desempeño haya caído por debajo de la barrera europea del 55%, proporcionando un colchón bajista del 45%.',
  },

  sellingPoints: {
    en: [
      'Premium 10.8% annual yield on high-conviction mega-cap tech names',
      'Memory feature recovers any missed coupon payments when stocks rebound',
      'European barrier observed only at maturity — intraday volatility doesn\'t trigger losses',
      '45% downside cushion before any principal loss',
      'Three of the highest-revenue AI companies in the world — META, AMZN, NVDA',
    ],
    es: [
      'Rendimiento premium del 10.8% anual en acciones tecnológicas mega-cap de alta convicción',
      'La función de memoria recupera cupones perdidos cuando las acciones se recuperan',
      'Barrera europea observada solo al vencimiento — la volatilidad intradía no genera pérdidas',
      'Colchón bajista del 45% antes de cualquier pérdida de capital',
      'Tres de las empresas de IA con mayores ingresos del mundo — META, AMZN, NVDA',
    ],
  },

  riskFactors: {
    en: [
      'Worst-of feature: return driven by the weakest stock in the basket',
      'Principal at risk if barrier breached at maturity — loss tracks the worst performer',
      'No participation in stock upside beyond coupon payments',
      'Issuer credit risk (Morgan Stanley)',
      'Limited secondary market liquidity — designed to hold to maturity',
      'Autocall may shorten tenor, forcing reinvestment in a potentially lower-rate environment',
    ],
    es: [
      'Característica worst-of: el retorno depende de la acción más débil de la canasta',
      'Capital en riesgo si se vulnera la barrera al vencimiento — la pérdida sigue al peor desempeño',
      'Sin participación en alzas de acciones más allá de los pagos de cupón',
      'Riesgo crediticio del emisor (Morgan Stanley)',
      'Liquidez limitada en el mercado secundario — diseñado para mantener hasta el vencimiento',
      'El autocall puede acortar el plazo, forzando reinversión en un entorno potencialmente de tasas más bajas',
    ],
  },

  talkTrack: {
    en: `This note pays you 2.7% every quarter — that's 10.8% annualized — as long as Meta, Amazon, and NVIDIA all stay above 65% of where they started. Miss a coupon? The memory feature means you collect everything owed once they recover. Every quarter starting month 6, if all three are at or above their starting price, you get your principal back plus any owed coupons. At maturity, you're fully protected unless the worst of the three has dropped more than 45% — and that's only checked on the final day. You're getting a double-digit yield on three of the biggest AI beneficiaries in the market, with nearly half the downside protected.`,
    es: `Esta nota le paga 2.7% cada trimestre — eso es 10.8% anualizado — mientras Meta, Amazon y NVIDIA se mantengan por encima del 65% de donde comenzaron. ¿Perdió un cupón? La función de memoria significa que cobra todo lo adeudado una vez que se recuperan. Cada trimestre a partir del mes 6, si las tres están al nivel o por encima de su precio inicial, usted recupera su capital más los cupones adeudados. Al vencimiento, está completamente protegido a menos que la peor de las tres haya caído más del 45% — y eso solo se verifica el último día. Está obteniendo un rendimiento de doble dígito en tres de los mayores beneficiarios de IA del mercado, con casi la mitad de la baja protegida.`,
  },
};
