import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { PRODUCT_TYPES, generateIntroPayoffData } from '../lib/intro-payoffs';
import SliderInput from '../components/SliderInput';

export default function Introduction({ strings: s }) {
  return (
    <div className="space-y-8">
      <HeroSection s={s} />
      <BuildingBlocksSection s={s} />
      <ThreeObjectivesSection s={s} />
      <PayoffPlayground s={s} />
      <GlossarySection s={s} />
      <RiskSection s={s} />
    </div>
  );
}

/* ─── Section 1: Hero ─── */
function HeroSection({ s }) {
  return (
    <Section title={s.introTitle}>
      <p className="text-base text-text-secondary leading-relaxed max-w-3xl">{s.introDesc}</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <InfoPill label={s.pill1to5Year} sub={s.pillMaturity} />
        <InfoPill label={s.pillHoldTo} sub={s.pillMaturity} />
        <InfoPill label={s.pillIssuer} sub={s.pillCreditRisk} />
        <InfoPill label={s.pillNot} sub={s.pillFdicInsured} />
      </div>
    </Section>
  );
}

function InfoPill({ label, sub }) {
  return (
    <div className="bg-bg-surface border border-bg-border rounded-full px-5 py-2 flex items-center gap-2">
      <span className="text-sm font-medium text-text">{label}</span>
      <span className="text-xs text-text-ghost">{sub}</span>
    </div>
  );
}

/* ─── Section 2: How It Works ─── */
function BuildingBlocksSection({ s }) {
  return (
    <Section title={s.introHowItWorks}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StepCard num="1" title={s.introStep1Title} desc={s.introStep1Desc} />
        <StepCard num="2" title={s.introStep2Title} desc={s.introStep2Desc} />
        <StepCard num="3" title={s.introStep3Title} desc={s.introStep3Desc} />
        <StepCard num="4" title={s.introStep4Title} desc={s.introStep4Desc} />
      </div>

      {/* Visual: the trade-off */}
      <div className="mt-6 bg-bg-surface border border-bg-border rounded-lg p-6">
        <div className="text-sm text-text-ghost uppercase tracking-wider mb-5">{s.coreTradeOff}</div>
        <div className="flex items-center gap-4 max-w-3xl">
          <div className="flex-1 border border-bg-border rounded-lg p-5 text-center">
            <div className="text-base font-medium text-red-400 mb-1">{s.tradeOffYouGiveUp}</div>
            <div className="text-sm text-text-muted">{s.tradeOffYouGiveUpDesc}</div>
          </div>
          <svg className="w-8 h-8 text-text-ghost flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex-1 border border-bg-border-light rounded-lg p-5 text-center bg-bg">
            <div className="text-base font-semibold text-text mb-1">{s.tradeOffStructuredNote}</div>
            <div className="text-sm text-text-muted">{s.tradeOffEquityLinked}</div>
            <div className="text-xs text-text-ghost mt-1">{s.tradeOffIssuerCredit}</div>
          </div>
          <svg className="w-8 h-8 text-text-ghost flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex-1 border border-bg-border rounded-lg p-5 text-center">
            <div className="text-base font-medium text-emerald-500 mb-1">{s.tradeOffYouGet}</div>
            <div className="text-sm text-text-muted">{s.tradeOffYouGetDesc}</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div className="bg-bg-surface border border-bg-border rounded-lg p-5">
      <div className="w-7 h-7 rounded-full border border-bg-border-light flex items-center justify-center text-sm font-mono font-semibold text-text-muted mb-3">{num}</div>
      <div className="text-sm font-medium text-text mb-1.5">{title}</div>
      <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
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
          <div key={o.key} className="bg-bg-surface border border-bg-border rounded-lg p-6 hover:border-bg-border-light transition-all">
            <svg className="w-7 h-7 text-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={o.icon} />
            </svg>
            <div className="text-base font-medium text-text mb-2">{o.title}</div>
            <p className="text-sm text-text-muted leading-relaxed">{o.desc}</p>
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

  return (
    <Section title={s.payoffPlayground}>
      <p className="text-sm text-text-muted mb-5">{s.playgroundDesc}</p>

      {/* Product type selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRODUCT_TYPES.map((p) => (
          <button
            key={p.id}
            onClick={() => handleTypeChange(p.id)}
            className={`px-4 py-2 text-sm rounded-md border transition-all ${
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
        <span className={`text-xs uppercase tracking-wider font-medium ${categoryColors[config.category]}`}>
          {categoryLabels[config.category]}
        </span>
        <span className="text-sm text-text-muted">{descs[selectedType]}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="w-full" style={{ height: 440 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 30, right: 50, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--bg-border))" strokeOpacity={0.5} />
                <XAxis
                  dataKey="underlying"
                  tick={{ fontSize: 13, fill: 'rgb(var(--text-ghost))' }}
                  tickFormatter={(v) => `${v}%`}
                  ticks={[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50]}
                />
                <YAxis
                  tick={{ fontSize: 13, fill: 'rgb(var(--text-ghost))' }}
                  tickFormatter={(v) => `${v}%`}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-bg-surface border border-bg-border rounded px-3 py-2 text-sm">
                        <div className="text-text-muted mb-1">{s.underlyingReturn}: {d.underlying}%</div>
                        <div className="text-text font-medium">{s.noteReturn}: {d.note}%</div>
                        <div className="text-text-ghost">{s.directExposure}: {d.directReturn}%</div>
                      </div>
                    );
                  }}
                />
                {/* Break-even lines */}
                <ReferenceLine y={0} stroke="rgb(var(--text-ghost))" strokeDasharray="2 2" strokeOpacity={0.3} />
                <ReferenceLine x={0} stroke="rgb(var(--text-ghost))" strokeDasharray="2 2" strokeOpacity={0.3} />

                {/* Buffer reference line */}
                {params.buffer != null && (
                  <ReferenceLine
                    x={Math.round(-params.buffer * 1000) / 10}
                    stroke="rgb(239, 68, 68)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.7}
                  >
                    <Label
                      value={`${s.buffer} -${(params.buffer * 100).toFixed(0)}%`}
                      position="insideTopLeft"
                      offset={10}
                      style={{ fontSize: 13, fill: 'rgb(239, 68, 68)', fontWeight: 600 }}
                    />
                  </ReferenceLine>
                )}

                {/* Cap reference line */}
                {params.cap != null && (
                  <ReferenceLine
                    x={Math.round(params.cap * 1000) / 10}
                    stroke="rgb(34, 197, 94)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.7}
                  >
                    <Label
                      value={`${s.cap} ${(params.cap * 100).toFixed(0)}%`}
                      position="insideTopRight"
                      offset={10}
                      style={{ fontSize: 13, fill: 'rgb(34, 197, 94)', fontWeight: 600 }}
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
                        value={`${s.maxReturn} ${maxRet.toFixed(0)}%`}
                        position="insideTopRight"
                        offset={5}
                        style={{ fontSize: 13, fill: 'rgb(34, 197, 94)', fontWeight: 500 }}
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
                      value={`${s.coupon} ${(params.coupon * 100).toFixed(1)}%`}
                      position="insideTopRight"
                      offset={5}
                      style={{ fontSize: 13, fill: 'rgb(245, 158, 11)', fontWeight: 500 }}
                    />
                  </ReferenceLine>
                )}

                {/* Leverage annotation — placed on upside slope */}
                {params.leverage != null && params.leverage > 1 && (
                  <ReferenceLine x={3} stroke="transparent">
                    <Label
                      value={`${params.leverage}x ${s.upsideLeverage}`}
                      position="insideBottomRight"
                      offset={15}
                      style={{ fontSize: 13, fill: 'rgb(var(--text-muted))', fontWeight: 500 }}
                    />
                  </ReferenceLine>
                )}

                {/* 1x downside label for return enhanced */}
                {selectedType === 'returnEnhanced' && (
                  <ReferenceLine x={-25} stroke="transparent">
                    <Label
                      value={`1x ${s.downsideParticipation}`}
                      position="insideBottomLeft"
                      offset={5}
                      style={{ fontSize: 13, fill: 'rgb(var(--text-ghost))' }}
                    />
                  </ReferenceLine>
                )}

                {/* Gearing label for buffered products */}
                {params.buffer != null && selectedType !== 'marketProtection' && selectedType !== 'dualDirectional' && (
                  <ReferenceLine x={-40} stroke="transparent">
                    <Label
                      value={`${(1 / (1 - params.buffer) * 100).toFixed(0)}% ${s.downsideParticipation}`}
                      position="insideBottomLeft"
                      offset={5}
                      style={{ fontSize: 13, fill: 'rgb(var(--text-ghost))' }}
                    />
                  </ReferenceLine>
                )}

                {/* Direct exposure (dashed) */}
                <Line
                  type="monotone"
                  dataKey="directReturn"
                  stroke="rgb(var(--text-ghost))"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  dot={false}
                  strokeOpacity={0.35}
                  name={s.directExposure}
                />
                {/* Note return (solid) */}
                <Line
                  type="monotone"
                  dataKey="note"
                  stroke="rgb(var(--text))"
                  strokeWidth={2.5}
                  dot={false}
                  name={s.noteReturn}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-6 -mt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-text rounded" />
              <span className="text-xs text-text-muted">{s.noteReturn}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0 border-t border-dashed border-text-ghost/40" />
              <span className="text-xs text-text-ghost">{s.directExposure}</span>
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
          <div className="mt-4 bg-bg-surface border border-bg-border rounded-lg p-5 flex-1">
            <div className="text-sm text-text-ghost uppercase tracking-wider mb-3">{s.outcomesAtMaturity}</div>
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
    <table className="w-full text-sm">
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
          const isBufferEdge = params.buffer && Math.abs(Math.abs(level) - params.buffer) < 0.011;
          const isCapEdge = params.cap && Math.abs(level - params.cap) < 0.011;
          return (
            <tr key={level} className={`border-t border-bg-border/50 ${isBufferEdge ? 'bg-red-500/5' : isCapEdge ? 'bg-emerald-500/5' : ''}`}>
              <td className="py-2 text-text-muted tabular-nums">{(level * 100).toFixed(0)}%</td>
              <td className={`py-2 text-right tabular-nums font-mono ${isPositive ? 'text-emerald-500' : isNeg ? 'text-red-400' : 'text-text-muted'}`}>
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
            className="text-left bg-bg-surface border border-bg-border rounded-lg px-5 py-4 hover:border-bg-border-light transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">{g.term}</span>
              <svg
                className={`w-4 h-4 text-text-ghost transition-transform duration-200 ${openTerm === i ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {openTerm === i && (
              <p className="text-sm text-text-muted mt-2 leading-relaxed">{g.def}</p>
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
          <div key={i} className="bg-bg-surface border border-bg-border rounded-lg p-5">
            <div className="text-sm font-medium text-text mb-2">{r.title}</div>
            <p className="text-sm text-text-muted leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-bg border border-bg-border/50 rounded-lg p-8">
      <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-5">{title}</h3>
      {children}
    </div>
  );
}
