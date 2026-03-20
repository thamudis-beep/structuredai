import React, { useState } from 'react';
import PayoffDiagram from '../components/PayoffDiagram';

// Resolve translated field: supports both string and {en, es} object
function t(field, lang) {
  if (field && typeof field === 'object' && !Array.isArray(field)) return field[lang] || field.en;
  return field;
}
function tArr(field, lang) {
  if (field && typeof field === 'object' && !Array.isArray(field)) return field[lang] || field.en;
  return field;
}

export default function FAMode({ product, strings, lang = 'en' }) {
  const [copied, setCopied] = useState(false);

  const talkTrack = t(product.talkTrack, lang);

  const copyTalkTrack = () => {
    navigator.clipboard.writeText(talkTrack);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Product Summary */}
      <Section title={strings.productSummary}>
        <p className="text-sm text-text-secondary leading-relaxed">{t(product.summary, lang)}</p>
      </Section>

      {/* Key Terms Table */}
      <Section title={strings.keyTerms}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TermCard label={strings.issuer} value={product.issuer} />
          <TermCard label={strings.tenor} value={`${product.tenor} ${strings.months}`} />
          <TermCard
            label={strings.underliers}
            value={product.underliers.map((u) => u.ticker).join(' / ')}
            sub={strings.worstOf}
          />
          <TermCard label={strings.notional} value={`$${(product.notional / 1e6).toFixed(1)}M`} />
          <TermCard
            label={strings.coupon}
            value={`${(product.coupon.rate * 100).toFixed(1)}% ${strings[product.coupon.frequency]}`}
            sub={[
              product.coupon.type === 'conditional' ? strings.conditional : strings.fixed,
              product.coupon.memory ? strings.memory : null,
            ].filter(Boolean).join(' · ')}
          />
          <TermCard
            label={strings.barrier}
            value={`${(product.barrier.level * 100).toFixed(0)}%`}
            sub={strings[product.barrier.type]}
          />
          {product.autocall?.enabled && (
            <TermCard
              label={strings.autocall}
              value={`${(product.autocall.triggerLevel * 100).toFixed(0)}%`}
              sub={`${strings[product.autocall.frequency]} from mo. ${product.autocall.startMonth}`}
            />
          )}
          <TermCard label={strings.maturity} value={product.maturityDate} />
        </div>
      </Section>

      {/* Payoff Diagram with advanced controls */}
      <Section title={strings.payoffDiagram}>
        <PayoffDiagram product={product} strings={strings} showControls={true} />
      </Section>

      {/* Selling Points */}
      <Section title={strings.sellingPoints}>
        <ul className="space-y-2.5">
          {tArr(product.sellingPoints, lang).map((p, i) => (
            <li key={i} className="text-sm text-text-secondary flex gap-2.5">
              <span className="text-emerald-500 mt-0.5 flex-shrink-0">+</span>
              {p}
            </li>
          ))}
        </ul>
      </Section>

      {/* Risk Factors */}
      <Section title={strings.riskFactors}>
        <ul className="space-y-2.5">
          {tArr(product.riskFactors, lang).map((r, i) => (
            <li key={i} className="text-sm text-text-secondary flex gap-2.5">
              <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
              {r}
            </li>
          ))}
        </ul>
      </Section>

      {/* 60-Second Talk Track */}
      <Section title={strings.talkTrack}>
        <div className="bg-bg-surface border border-bg-border rounded-lg p-5 relative">
          <p className="text-sm text-text-secondary leading-relaxed italic pr-16">{talkTrack}</p>
          <button
            onClick={copyTalkTrack}
            className="absolute top-4 right-4 text-xs text-text-muted hover:text-text border border-bg-border hover:border-bg-border-light rounded px-2.5 py-1 transition-all"
          >
            {copied ? strings.copied : strings.copy}
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-bg border border-bg-border/50 rounded-lg p-6">
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function TermCard({ label, value, sub }) {
  return (
    <div className="bg-bg-surface border border-bg-border rounded-lg px-4 py-3">
      <div className="text-xs text-text-ghost mb-1">{label}</div>
      <div className="text-sm font-medium text-text">{value}</div>
      {sub && <div className="text-2xs text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}
