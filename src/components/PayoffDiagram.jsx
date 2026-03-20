import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';
import { generatePayoffCurve, calcTotalReturn } from '../lib/payoff-engine';
import SliderInput from './SliderInput';

export default function PayoffDiagram({ product, strings, showControls = false }) {
  // Individual underlier sliders — one per stock
  const underliers = product.underliers || [];
  const [stockLevels, setStockLevels] = useState(() => {
    const init = {};
    underliers.forEach((u) => { init[u.ticker] = 100; });
    return init;
  });

  const updateStockLevel = (ticker, value) => {
    setStockLevels((prev) => ({ ...prev, [ticker]: value }));
  };

  // Derive worst-of level from individual stock levels
  const stockValues = underliers.map((u) => stockLevels[u.ticker] ?? 100);
  const worstOfLevel = stockValues.length > 0 ? Math.min(...stockValues) : 100;
  const worstPerformer = underliers.find((u) => (stockLevels[u.ticker] ?? 100) === worstOfLevel);

  // Optional advanced controls
  const [barrierOverride, setBarrierOverride] = useState(product.barrier.level * 100);
  const [couponOverride, setCouponOverride] = useState(product.coupon.rate * 100);

  // Build product with overrides for curve
  const effectiveProduct = useMemo(() => {
    if (!showControls) return product;
    return {
      ...product,
      barrier: { ...product.barrier, level: barrierOverride / 100 },
      coupon: { ...product.coupon, rate: couponOverride / 100 },
    };
  }, [product, showControls, barrierOverride, couponOverride]);

  // Generate curve data
  const data = useMemo(() => generatePayoffCurve(effectiveProduct, 0, 2.0, 200), [effectiveProduct]);

  // Current point calculation — use worst-of level
  const currentReturn = useMemo(
    () => calcTotalReturn(effectiveProduct, worstOfLevel / 100),
    [effectiveProduct, worstOfLevel]
  );

  const barrierPct = effectiveProduct.barrier.level * 100;
  const notional = product.notional;
  const dollarReturn = currentReturn.total * notional;
  const pnl = dollarReturn - notional;

  return (
    <div>
      {/* Return readout */}
      <div className="flex items-baseline gap-6 mb-5 flex-wrap">
        <div>
          <div className="text-xs text-text-ghost mb-0.5">{strings.worstOfLevel || 'Worst-Of Level'}</div>
          <div className="text-lg font-mono font-semibold text-text tabular-nums">{worstOfLevel.toFixed(0)}%</div>
        </div>
        {worstPerformer && (
          <div>
            <div className="text-xs text-text-ghost mb-0.5">{strings.worstPerformer || 'Worst Performer'}</div>
            <div className="text-sm font-mono font-semibold text-red-400">{worstPerformer.ticker}</div>
          </div>
        )}
        <div>
          <div className="text-xs text-text-ghost mb-0.5">{strings.yourReturn}</div>
          <div className={`text-lg font-mono font-semibold tabular-nums ${pnl >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
            {pnl >= 0 ? '+' : ''}{((currentReturn.total - 1) * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-text-ghost mb-0.5">{strings.onNotional} ${(notional / 1e6).toFixed(1)}M</div>
          <div className={`text-sm font-mono tabular-nums ${pnl >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
            {pnl >= 0 ? '+' : ''}${(pnl / 1000).toFixed(0)}k
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="payoffGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--text))" stopOpacity={0.08} />
                <stop offset="95%" stopColor="rgb(var(--text))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--bg-border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="level"
              tick={{ fontSize: 10, fill: 'rgb(var(--text-ghost))' }}
              tickFormatter={(v) => `${v}%`}
              ticks={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]}
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
                    <div className="text-text-muted mb-1">Underlying: {d.level}%</div>
                    <div className="text-text">Total return: {d.total}%</div>
                    <div className="text-text-ghost">Principal: {d.principal}% | Coupon: {d.coupon}%</div>
                  </div>
                );
              }}
            />
            {/* Barrier reference line */}
            <ReferenceLine
              x={Math.round(barrierPct * 10) / 10}
              stroke="rgb(239, 68, 68)"
              strokeDasharray="4 3"
              strokeOpacity={0.6}
              label={{ value: `Barrier ${barrierPct}%`, position: 'top', fontSize: 10, fill: 'rgb(239, 68, 68)' }}
            />
            {/* Break-even line at 100% */}
            <ReferenceLine
              y={100}
              stroke="rgb(var(--text-ghost))"
              strokeDasharray="2 2"
              strokeOpacity={0.4}
            />
            {/* Current worst-of indicator */}
            <ReferenceLine
              x={worstOfLevel}
              stroke="rgb(var(--text))"
              strokeWidth={1.5}
              strokeOpacity={0.4}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="rgb(var(--text))"
              strokeWidth={1.5}
              fill="url(#payoffGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Per-underlier sliders */}
      <div className="mt-4 max-w-md space-y-0">
        {underliers.map((u) => {
          const level = stockLevels[u.ticker] ?? 100;
          const isWorst = worstPerformer && worstPerformer.ticker === u.ticker;
          return (
            <div key={u.ticker} className={isWorst ? 'pl-2 border-l-2 border-red-400/60' : 'pl-2 border-l-2 border-transparent'}>
              <SliderInput
                label={`${u.ticker} — ${u.name}`}
                value={level}
                min={0}
                max={200}
                step={1}
                onChange={(v) => updateStockLevel(u.ticker, v)}
                formatValue={(v) => `${v}%${isWorst ? ' (worst)' : ''}`}
              />
            </div>
          );
        })}
      </div>

      {/* Advanced controls (FA mode only) */}
      {showControls && (
        <details className="mt-4">
          <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary">
            {strings.advancedControls}
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-4 max-w-md">
            <SliderInput
              label={strings.barrierLevel}
              value={barrierOverride}
              min={30}
              max={90}
              step={1}
              onChange={setBarrierOverride}
              formatValue={(v) => `${v}%`}
            />
            <SliderInput
              label={strings.couponRate}
              value={couponOverride}
              min={1}
              max={20}
              step={0.1}
              onChange={setCouponOverride}
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
          </div>
        </details>
      )}
    </div>
  );
}
