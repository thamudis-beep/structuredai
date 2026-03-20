import React, { useState, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';
import { PRODUCT_TYPES, generateIntroPayoffData } from '../lib/intro-payoffs';
import SliderInput from '../components/SliderInput';

export default function Introduction({ strings: s }) {
  return (
    <div className="space-y-8">
      <WhatIsSection s={s} />
      <BuildingBlocksSection s={s} />
      <ThreeObjectivesSection s={s} />
      <PayoffPlayground s={s} />
      <GlossarySection s={s} />
      <RiskSection s={s} />
    </div>
  );
}

/* ─── Section 1: What is a Structured Investment? ─── */
function WhatIsSection({ s }) {
  return (
    <Section title={s.introTitle}>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">{s.introDesc}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-bg-surface border border-bg-border rounded-lg p-4">
          <div className="text-xs text-text-ghost uppercase tracking-wider mb-2">Hold to Maturity</div>
          <p className="text-xs text-text-muted leading-relaxed">{s.introHeldToMaturity}</p>
        </div>
        <div className="bg-bg-surface border border-bg-border rounded-lg p-4">
          <div className="text-xs text-text-ghost uppercase tracking-wider mb-2">Credit Risk</div>
          <p className="text-xs text-text-muted leading-relaxed">{s.introCreditRisk}</p>
        </div>
      </div>
    </Section>
  );
}

/* ─── Section 2: Building Blocks — animated SVG ─── */
function BuildingBlocksSection({ s }) {
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const blocks = [
    { id: 'bond', label: s.blockBond, desc: s.blockBondDesc, pct: '~85-95%', color: 'rgb(var(--text-secondary))' },
    { id: 'options', label: s.blockOptions, desc: s.blockOptionsDesc, pct: '~5-15%', color: 'rgb(var(--text-muted))' },
    { id: 'underlying', label: s.blockUnderlying, desc: s.blockUnderlyingDesc, pct: 'Reference', color: 'rgb(var(--text-ghost))' },
  ];

  return (
    <Section title={s.buildingBlocks}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Visual: stacked bar */}
        <div className="flex-shrink-0 w-full md:w-48">
          <svg viewBox="0 0 120 200" className="w-full h-48">
            {/* Bond block */}
            <rect x="10" y="10" width="100" height="110" rx="4"
              fill={hoveredBlock === 'bond' ? 'rgb(var(--bg-border-light))' : 'rgb(var(--bg-border))'}
              stroke="rgb(var(--text-ghost))" strokeWidth="0.5"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredBlock('bond')}
              onMouseLeave={() => setHoveredBlock(null)}
            />
            <text x="60" y="60" textAnchor="middle" fontSize="10" fill="rgb(var(--text-secondary))" fontWeight="600">{s.blockBond}</text>
            <text x="60" y="76" textAnchor="middle" fontSize="8" fill="rgb(var(--text-ghost))">~85-95%</text>

            {/* Options block */}
            <rect x="10" y="125" width="100" height="35" rx="4"
              fill={hoveredBlock === 'options' ? 'rgb(var(--bg-border-light))' : 'rgb(var(--bg-surface))'}
              stroke="rgb(var(--text-ghost))" strokeWidth="0.5"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredBlock('options')}
              onMouseLeave={() => setHoveredBlock(null)}
            />
            <text x="60" y="146" textAnchor="middle" fontSize="10" fill="rgb(var(--text-secondary))" fontWeight="600">{s.blockOptions}</text>
            <text x="60" y="158" textAnchor="middle" fontSize="8" fill="rgb(var(--text-ghost))">~5-15%</text>

            {/* Arrow to underlying */}
            <line x1="60" y1="165" x2="60" y2="180" stroke="rgb(var(--text-ghost))" strokeWidth="1" strokeDasharray="3 2" />
            <polygon points="55,178 60,186 65,178" fill="rgb(var(--text-ghost))" />
            <text x="60" y="198" textAnchor="middle" fontSize="8" fill="rgb(var(--text-ghost))">{s.blockUnderlying}</text>
          </svg>
        </div>

        {/* Text cards */}
        <div className="flex-1 grid grid-cols-1 gap-3">
          {blocks.map((b) => (
            <div
              key={b.id}
              className={`border rounded-lg px-4 py-3 transition-all duration-200 cursor-default ${
                hoveredBlock === b.id ? 'border-bg-border-light bg-bg-surface' : 'border-bg-border'
              }`}
              onMouseEnter={() => setHoveredBlock(b.id)}
              onMouseLeave={() => setHoveredBlock(null)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-text">{b.label}</span>
                <span className="text-2xs text-text-ghost">{b.pct}</span>
              </div>
              <p className="text-xs text-text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Section 3: Three Objectives ─── */
function ThreeObjectivesSection({ s }) {
  const objectives = [
    { key: 'growth', title: s.objGrowth, desc: s.objGrowthDesc, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { key: 'protection', title: s.objProtection, desc: s.objProtectionDesc, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { key: 'income', title: s.objIncome, desc: s.objIncomeDesc, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];
  return (
    <Section title={s.threeObjectives}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {objectives.map((o) => (
          <div key={o.key} className="bg-bg-surface border border-bg-border rounded-lg p-5 hover:border-bg-border-light transition-all">
            <svg className="w-6 h-6 text-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={o.icon} />
            </svg>
            <div className="text-sm font-medium text-text mb-2">{o.title}</div>
            <p className="text-xs text-text-muted leading-relaxed">{o.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Section 4: Interactive Payoff Playground ─── */
function PayoffPlayground({ s }) {
  const [selectedType, setSelectedType] = useState('returnEnhanced');
  const config = PRODUCT_TYPES.find((p) => p.id === selectedType);

  // Build initial params from defaults
  const [params, setParams] = useState(() => ({ ...config.defaults }));

  // Reset params when product type changes
  const handleTypeChange = (id) => {
    setSelectedType(id);
    const newConfig = PRODUCT_TYPES.find((p) => p.id === id);
    setParams({ ...newConfig.defaults });
  };

  const updateParam = (key, val) => setParams((p) => ({ ...p, [key]: val }));

  // Generate chart data
  const data = useMemo(
    () => generateIntroPayoffData(config.fn, params, -0.5, 0.5, 300),
    [config, params]
  );

  // Product name/desc mapping
  const names = {
    returnEnhanced: s.productReturnEnhanced,
    marketProtection: s.productMarketProtection,
    bufferedReturnEnhanced: s.productBufferedReturnEnhanced,
    bufferedEquity: s.productBufferedEquity,
    dualDirectional: s.productDualDirectional,
    bufferedCoupon: s.productBufferedCoupon,
  };
  const descs = {
    returnEnhanced: s.descReturnEnhanced,
    marketProtection: s.descMarketProtection,
    bufferedReturnEnhanced: s.descBufferedReturnEnhanced,
    bufferedEquity: s.descBufferedEquity,
    dualDirectional: s.descDualDirectional,
    bufferedCoupon: s.descBufferedCoupon,
  };

  // Slider label mapping
  const sliderLabels = {
    leverage: s.leverage,
    cap: s.cap,
    buffer: s.buffer,
    maxReturn: s.maxReturn,
    coupon: s.coupon,
    protection: s.protection,
  };

  const categoryColors = { growth: 'text-emerald-500', protection: 'text-blue-400', income: 'text-amber-400' };
  const categoryLabels = { growth: s.objGrowth, protection: s.objProtection, income: s.objIncome };

  return (
    <Section title={s.payoffPlayground}>
      <p className="text-xs text-text-muted mb-5">{s.playgroundDesc}</p>

      {/* Product type selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRODUCT_TYPES.map((p) => (
          <button
            key={p.id}
            onClick={() => handleTypeChange(p.id)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
              selectedType === p.id
                ? 'bg-bg-surface text-text border-bg-border-light'
                : 'text-text-muted border-bg-border hover:text-text-secondary hover:border-bg-border-light'
            }`}
          >
            {names[p.id]}
          </button>
        ))}
      </div>

      {/* Selected product info */}
      <div className="mb-5 flex items-center gap-3">
        <span className={`text-2xs uppercase tracking-wider font-medium ${categoryColors[config.category]}`}>
          {categoryLabels[config.category]}
        </span>
        <span className="text-xs text-text-muted">{descs[selectedType]}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--bg-border))" strokeOpacity={0.5} />
                <XAxis
                  dataKey="underlying"
                  tick={{ fontSize: 10, fill: 'rgb(var(--text-ghost))' }}
                  tickFormatter={(v) => `${v}%`}
                  ticks={[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50]}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'rgb(var(--text-ghost))' }}
                  tickFormatter={(v) => `${v}%`}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-bg-surface border border-bg-border rounded px-3 py-2 text-xs">
                        <div className="text-text-muted mb-1">{s.underlyingReturn}: {d.underlying}%</div>
                        <div className="text-text font-medium">{s.noteReturn}: {d.note}%</div>
                        <div className="text-text-ghost">{s.directExposure}: {d.directReturn}%</div>
                      </div>
                    );
                  }}
                />
                {/* Break-even line */}
                <ReferenceLine y={0} stroke="rgb(var(--text-ghost))" strokeDasharray="2 2" strokeOpacity={0.4} />
                <ReferenceLine x={0} stroke="rgb(var(--text-ghost))" strokeDasharray="2 2" strokeOpacity={0.4} />

                {/* Buffer reference line */}
                {params.buffer && (
                  <ReferenceLine
                    x={Math.round(-params.buffer * 1000) / 10}
                    stroke="rgb(239, 68, 68)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.5}
                  />
                )}

                {/* Cap reference line */}
                {params.cap && (
                  <ReferenceLine
                    x={Math.round(params.cap * 1000) / 10}
                    stroke="rgb(34, 197, 94)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.5}
                  />
                )}

                {/* Direct exposure (dashed gray line) */}
                <Line
                  type="monotone"
                  dataKey="directReturn"
                  stroke="rgb(var(--text-ghost))"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  dot={false}
                  strokeOpacity={0.4}
                />
                {/* Note return (solid line) */}
                <Line
                  type="monotone"
                  dataKey="note"
                  stroke="rgb(var(--text))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 bg-text rounded" />
              <span className="text-2xs text-text-muted">{s.noteReturn}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 rounded" style={{ background: 'rgb(var(--text-ghost))', opacity: 0.4 }} />
              <span className="text-2xs text-text-ghost">{s.directExposure}</span>
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-1">
          {config.sliders.map((sl) => {
            const val = params[sl.key] ?? config.defaults[sl.key];
            return (
              <SliderInput
                key={`${selectedType}-${sl.key}`}
                label={sliderLabels[sl.key] || sl.key}
                value={sl.format === 'x' ? val : val * 100}
                min={sl.format === 'x' ? sl.min : sl.min * 100}
                max={sl.format === 'x' ? sl.max : sl.max * 100}
                step={sl.format === 'x' ? sl.step : sl.step * 100}
                onChange={(v) => updateParam(sl.key, sl.format === 'x' ? v : v / 100)}
                formatValue={(v) => sl.format === 'x' ? `${v.toFixed(1)}x` : `${v.toFixed(1)}%`}
              />
            );
          })}

          {/* Outcome table */}
          <div className="mt-4 bg-bg-surface border border-bg-border rounded-lg p-4">
            <div className="text-xs text-text-ghost uppercase tracking-wider mb-3">Outcomes at Maturity</div>
            <OutcomeTable config={config} params={params} s={s} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function OutcomeTable({ config, params, s }) {
  // Calculate returns at key levels
  const levels = [-0.30, -0.15, -0.05, 0, 0.05, 0.15, 0.30];
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-text-ghost">
          <th className="text-left pb-2 font-normal">{s.underlyingReturn}</th>
          <th className="text-right pb-2 font-normal">{s.noteReturn}</th>
        </tr>
      </thead>
      <tbody>
        {levels.map((level) => {
          const ret = config.fn(level, params);
          const isPositive = ret > 0;
          const isNeg = ret < 0;
          return (
            <tr key={level} className="border-t border-bg-border/50">
              <td className="py-1.5 text-text-muted tabular-nums">{(level * 100).toFixed(0)}%</td>
              <td className={`py-1.5 text-right tabular-nums font-mono ${isPositive ? 'text-emerald-500' : isNeg ? 'text-red-400' : 'text-text-muted'}`}>
                {ret >= 0 ? '+' : ''}{(ret * 100).toFixed(1)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ─── Section 5: Glossary ─── */
function GlossarySection({ s }) {
  const [openTerm, setOpenTerm] = useState(null);
  return (
    <Section title={s.glossaryTitle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {s.glossaryTerms.map((g, i) => (
          <button
            key={i}
            onClick={() => setOpenTerm(openTerm === i ? null : i)}
            className="text-left bg-bg-surface border border-bg-border rounded-lg px-4 py-3 hover:border-bg-border-light transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text">{g.term}</span>
              <svg
                className={`w-3.5 h-3.5 text-text-ghost transition-transform duration-200 ${openTerm === i ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {openTerm === i && (
              <p className="text-xs text-text-muted mt-2 leading-relaxed">{g.def}</p>
            )}
          </button>
        ))}
      </div>
    </Section>
  );
}

/* ─── Section 6: Risk Considerations ─── */
function RiskSection({ s }) {
  return (
    <Section title={s.riskConsiderations}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {s.risks.map((r, i) => (
          <div key={i} className="bg-bg-surface border border-bg-border rounded-lg p-4">
            <div className="text-xs font-medium text-text mb-1.5">{r.title}</div>
            <p className="text-xs text-text-muted leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Shared Section wrapper ─── */
function Section({ title, children }) {
  return (
    <div className="bg-bg border border-bg-border/50 rounded-lg p-6">
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-5">{title}</h3>
      {children}
    </div>
  );
}
