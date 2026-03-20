import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { PRODUCT_TYPES, generateIntroPayoffData } from '../lib/intro-payoffs';
import SliderInput from '../components/SliderInput';

export default function Introduction({ strings: s, onAnalyze }) {
  return (
    <div className="space-y-8">
      <HeroSection s={s} onAnalyze={onAnalyze} />
      <BuildingBlocksSection s={s} />
      <ThreeObjectivesSection s={s} />
      <PayoffPlayground s={s} />
      <GlossarySection s={s} />
      <RiskSection s={s} />
    </div>
  );
}

/* ─── Section 1: Hero — clean, simple ─── */
function HeroSection({ s, onAnalyze }) {
  return (
    <Section title={s.introTitle}>
      <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">{s.introDesc}</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <InfoPill label="1–5 year" sub="maturity" />
        <InfoPill label="Hold to" sub="maturity" />
        <InfoPill label="Issuer" sub="credit risk" />
        <InfoPill label="Not" sub="FDIC insured" />
      </div>
      {onAnalyze && (
        <button
          onClick={onAnalyze}
          className="mt-6 px-5 py-2.5 text-xs font-medium text-text bg-bg-surface border border-bg-border-light hover:border-text-ghost rounded-lg transition-all"
        >
          {s.upload} →
        </button>
      )}
    </Section>
  );
}

function InfoPill({ label, sub }) {
  return (
    <div className="bg-bg-surface border border-bg-border rounded-full px-4 py-1.5 flex items-center gap-1.5">
      <span className="text-xs font-medium text-text">{label}</span>
      <span className="text-2xs text-text-ghost">{sub}</span>
    </div>
  );
}

/* ─── Section 2: How It Works — equity-focused ─── */
function BuildingBlocksSection({ s }) {
  return (
    <Section title="How It Works">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StepCard num="1" title="Pick the stocks" desc="You choose the equities — individual names like META, NVDA, AMZN or an index like S&P 500." />
        <StepCard num="2" title="Set the terms" desc="Define your trade-offs: how much downside protection (buffer), what coupon you earn, and for how long (tenor)." />
        <StepCard num="3" title="Issuer structures the note" desc="The bank packages equity exposure with embedded derivatives to create the custom risk/return profile." />
        <StepCard num="4" title="Get paid based on performance" desc="At maturity, your return depends on how the stocks performed relative to the barriers and caps you agreed to." />
      </div>

      {/* Visual: the trade-off */}
      <div className="mt-6 bg-bg-surface border border-bg-border rounded-lg p-5">
        <div className="text-xs text-text-ghost uppercase tracking-wider mb-4">The Core Trade-Off</div>
        <svg viewBox="0 0 600 70" className="w-full max-w-2xl h-16">
          {/* You give up */}
          <rect x="0" y="10" width="180" height="50" rx="6" fill="rgb(var(--bg-border))" stroke="rgb(var(--text-ghost))" strokeWidth="0.5" />
          <text x="90" y="30" textAnchor="middle" fontSize="9" fill="rgb(var(--text-muted))" fontWeight="600">You give up</text>
          <text x="90" y="46" textAnchor="middle" fontSize="8" fill="rgb(var(--text-ghost))">Unlimited upside + dividends</text>

          {/* Arrow */}
          <line x1="190" y1="35" x2="220" y2="35" stroke="rgb(var(--text-ghost))" strokeWidth="1" />
          <polygon points="218,31 226,35 218,39" fill="rgb(var(--text-ghost))" />

          {/* Structured Note */}
          <rect x="230" y="5" width="140" height="60" rx="6" fill="rgb(var(--bg-border))" stroke="rgb(var(--text-muted))" strokeWidth="0.7" />
          <text x="300" y="28" textAnchor="middle" fontSize="10" fill="rgb(var(--text))" fontWeight="600">Structured Note</text>
          <text x="300" y="43" textAnchor="middle" fontSize="8" fill="rgb(var(--text-ghost))">Equity-linked payoff</text>
          <text x="300" y="55" textAnchor="middle" fontSize="7" fill="rgb(var(--text-ghost))">Issuer credit risk applies</text>

          {/* Arrow */}
          <line x1="380" y1="35" x2="410" y2="35" stroke="rgb(var(--text-ghost))" strokeWidth="1" />
          <polygon points="408,31 416,35 408,39" fill="rgb(var(--text-ghost))" />

          {/* You get */}
          <rect x="420" y="10" width="180" height="50" rx="6" fill="rgb(var(--bg-border))" stroke="rgb(var(--text-ghost))" strokeWidth="0.5" />
          <text x="510" y="30" textAnchor="middle" fontSize="9" fill="rgb(var(--text-muted))" fontWeight="600">You get</text>
          <text x="510" y="46" textAnchor="middle" fontSize="8" fill="rgb(var(--text-ghost))">Downside protection + enhanced income</text>
        </svg>
      </div>
    </Section>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div className="bg-bg-surface border border-bg-border rounded-lg p-4">
      <div className="w-6 h-6 rounded-full border border-bg-border-light flex items-center justify-center text-xs font-mono font-semibold text-text-muted mb-2">{num}</div>
      <div className="text-xs font-medium text-text mb-1">{title}</div>
      <p className="text-2xs text-text-muted leading-relaxed">{desc}</p>
    </div>
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
  const [params, setParams] = useState(() => ({ ...config.defaults }));

  const handleTypeChange = (id) => {
    setSelectedType(id);
    const newConfig = PRODUCT_TYPES.find((p) => p.id === id);
    setParams({ ...newConfig.defaults });
  };

  const updateParam = (key, val) => setParams((p) => ({ ...p, [key]: val }));

  const data = useMemo(
    () => generateIntroPayoffData(config.fn, params, -0.5, 0.5, 300),
    [config, params]
  );

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
  const sliderLabels = {
    leverage: s.leverage, cap: s.cap, buffer: s.buffer,
    maxReturn: s.maxReturn, coupon: s.coupon, protection: s.protection,
  };
  const categoryColors = { growth: 'text-emerald-500', protection: 'text-blue-400', income: 'text-amber-400' };
  const categoryLabels = { growth: s.objGrowth, protection: s.objProtection, income: s.objIncome };

  // Compute annotation points for chart labels
  const annotations = useMemo(() => {
    const a = [];
    const p = params;
    // Cap annotation
    if (p.cap != null) {
      const capPct = p.cap * 100;
      const maxRet = config.fn(p.cap, p);
      a.push({ x: capPct, y: maxRet * 100, label: `${capPct.toFixed(0)}% Cap`, anchor: 'start' });
      // Max return label
      const lev = p.leverage || 1;
      const maxRetPct = maxRet * 100;
      a.push({ x: capPct + 3, y: maxRetPct, label: `${maxRetPct.toFixed(0)}% Max Return`, anchor: 'start', color: 'emerald' });
    }
    if (p.maxReturn != null && p.cap == null) {
      const mrPct = p.maxReturn * 100;
      a.push({ x: mrPct, y: mrPct, label: `${mrPct.toFixed(0)}% Max Return`, anchor: 'start', color: 'emerald' });
    }
    // Buffer annotation
    if (p.buffer != null) {
      a.push({ x: -p.buffer * 100, y: 0, label: `${(p.buffer * 100).toFixed(0)}% Buffer`, anchor: 'end', color: 'red' });
    }
    // Protection annotation
    if (p.protection != null && p.protection >= 1) {
      a.push({ x: -30, y: 0, label: '100% Protected', anchor: 'middle', color: 'blue' });
    }
    // Leverage annotation
    if (p.leverage != null && p.leverage > 1) {
      const midCap = (p.cap || 0.10) * 50; // halfway to cap
      const midRet = config.fn(midCap / 100, p) * 100;
      a.push({ x: midCap, y: midRet, label: `${p.leverage}x Leverage`, anchor: 'start' });
    }
    // Coupon annotation
    if (p.coupon != null) {
      a.push({ x: 15, y: p.coupon * 100, label: `${(p.coupon * 100).toFixed(1)}% Coupon`, anchor: 'start', color: 'amber' });
    }
    return a;
  }, [config, params]);

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
        {/* Chart — tall to match sidebar */}
        <div className="lg:col-span-2">
          <div className="w-full" style={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--bg-border))" strokeOpacity={0.5} />
                <XAxis
                  dataKey="underlying"
                  tick={{ fontSize: 12, fill: 'rgb(var(--text-ghost))' }}
                  tickFormatter={(v) => `${v}%`}
                  ticks={[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50]}
                >
                  <Label value="Underlying Return" position="bottom" offset={0} style={{ fontSize: 12, fill: 'rgb(var(--text-ghost))' }} />
                </XAxis>
                <YAxis
                  tick={{ fontSize: 12, fill: 'rgb(var(--text-ghost))' }}
                  tickFormatter={(v) => `${v}%`}
                  domain={['auto', 'auto']}
                >
                  <Label value="Note Return" angle={-90} position="insideLeft" offset={0} style={{ fontSize: 12, fill: 'rgb(var(--text-ghost))' }} />
                </YAxis>
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
                {/* Break-even lines */}
                <ReferenceLine y={0} stroke="rgb(var(--text-ghost))" strokeDasharray="2 2" strokeOpacity={0.3} />
                <ReferenceLine x={0} stroke="rgb(var(--text-ghost))" strokeDasharray="2 2" strokeOpacity={0.3}>
                  <Label value="Point of Investment" position="top" style={{ fontSize: 11, fill: 'rgb(var(--text-ghost))' }} />
                </ReferenceLine>

                {/* Buffer reference line with label */}
                {params.buffer != null && (
                  <ReferenceLine
                    x={Math.round(-params.buffer * 1000) / 10}
                    stroke="rgb(239, 68, 68)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.6}
                  >
                    <Label
                      value={`-${(params.buffer * 100).toFixed(0)}% Buffer`}
                      position="top"
                      style={{ fontSize: 11, fill: 'rgb(239, 68, 68)' }}
                    />
                  </ReferenceLine>
                )}

                {/* Cap reference line with label */}
                {params.cap != null && (
                  <ReferenceLine
                    x={Math.round(params.cap * 1000) / 10}
                    stroke="rgb(34, 197, 94)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.6}
                  >
                    <Label
                      value={`${(params.cap * 100).toFixed(0)}% Cap`}
                      position="top"
                      style={{ fontSize: 11, fill: 'rgb(34, 197, 94)' }}
                    />
                  </ReferenceLine>
                )}

                {/* Max return horizontal line */}
                {(() => {
                  const capVal = params.cap ?? params.maxReturn;
                  if (capVal == null) return null;
                  const maxRet = config.fn(capVal, params) * 100;
                  return (
                    <ReferenceLine
                      y={Math.round(maxRet * 10) / 10}
                      stroke="rgb(34, 197, 94)"
                      strokeDasharray="4 3"
                      strokeOpacity={0.4}
                    >
                      <Label
                        value={`${maxRet.toFixed(0)}% Max Return`}
                        position="right"
                        style={{ fontSize: 11, fill: 'rgb(34, 197, 94)' }}
                      />
                    </ReferenceLine>
                  );
                })()}

                {/* Coupon level line */}
                {params.coupon != null && (
                  <ReferenceLine
                    y={params.coupon * 100}
                    stroke="rgb(245, 158, 11)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.5}
                  >
                    <Label
                      value={`${(params.coupon * 100).toFixed(1)}% Coupon`}
                      position="right"
                      style={{ fontSize: 11, fill: 'rgb(245, 158, 11)' }}
                    />
                  </ReferenceLine>
                )}

                {/* Leverage annotation — custom label via ReferenceDot workaround */}
                {params.leverage != null && params.leverage > 1 && (() => {
                  const capVal = params.cap ?? 0.10;
                  const midX = capVal * 50;
                  return (
                    <ReferenceLine
                      x={midX}
                      stroke="transparent"
                    >
                      <Label
                        value={`${params.leverage}x Upside Leverage`}
                        position="insideTopRight"
                        style={{ fontSize: 11, fill: 'rgb(var(--text-muted))' }}
                      />
                    </ReferenceLine>
                  );
                })()}

                {/* 1x downside label for return enhanced */}
                {selectedType === 'returnEnhanced' && (
                  <ReferenceLine x={-25} stroke="transparent">
                    <Label
                      value="1x Downside Participation"
                      position="insideBottomLeft"
                      style={{ fontSize: 11, fill: 'rgb(var(--text-ghost))' }}
                    />
                  </ReferenceLine>
                )}

                {/* Gearing label for buffered products */}
                {params.buffer != null && selectedType !== 'marketProtection' && selectedType !== 'dualDirectional' && (
                  <ReferenceLine x={-40} stroke="transparent">
                    <Label
                      value={`${(1 / (1 - params.buffer) * 100).toFixed(0)}% Downside Participation`}
                      position="insideBottomLeft"
                      style={{ fontSize: 11, fill: 'rgb(var(--text-ghost))' }}
                    />
                  </ReferenceLine>
                )}

                {/* Direct exposure (dashed line) */}
                <Line
                  type="monotone"
                  dataKey="directReturn"
                  stroke="rgb(var(--text-ghost))"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  dot={false}
                  strokeOpacity={0.35}
                  name="Direct Exposure"
                />
                {/* Note return (solid) */}
                <Line
                  type="monotone"
                  dataKey="note"
                  stroke="rgb(var(--text))"
                  strokeWidth={2.5}
                  dot={false}
                  name="Note Return"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-text rounded" />
              <span className="text-2xs text-text-muted">{s.noteReturn}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0 border-t border-dashed border-text-ghost/40" />
              <span className="text-2xs text-text-ghost">{s.directExposure}</span>
            </div>
          </div>
        </div>

        {/* Sliders + Outcome Table */}
        <div className="flex flex-col">
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
          </div>

          {/* Outcome table */}
          <div className="mt-4 bg-bg-surface border border-bg-border rounded-lg p-4 flex-1">
            <div className="text-xs text-text-ghost uppercase tracking-wider mb-3">Outcomes at Maturity</div>
            <OutcomeTable config={config} params={params} s={s} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function OutcomeTable({ config, params, s }) {
  const levels = [-0.30, -0.15, -0.10, -0.05, 0, 0.05, 0.10, 0.15, 0.30];
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
          const isPositive = ret > 0.001;
          const isNeg = ret < -0.001;
          // Highlight buffer/cap boundaries
          const isBufferEdge = params.buffer && Math.abs(Math.abs(level) - params.buffer) < 0.011;
          const isCapEdge = params.cap && Math.abs(level - params.cap) < 0.011;
          return (
            <tr key={level} className={`border-t border-bg-border/50 ${isBufferEdge ? 'bg-red-500/5' : isCapEdge ? 'bg-emerald-500/5' : ''}`}>
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

function Section({ title, children }) {
  return (
    <div className="bg-bg border border-bg-border/50 rounded-lg p-6">
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-5">{title}</h3>
      {children}
    </div>
  );
}
