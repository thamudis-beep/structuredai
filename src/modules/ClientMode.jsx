import React from 'react';
import PayoffDiagram from '../components/PayoffDiagram';

// Resolve translated field: supports both string and {en, es} object
function t(field, lang) {
  if (field && typeof field === 'object' && !Array.isArray(field)) return field[lang] || field.en;
  return field;
}

export default function ClientMode({ product, strings, lang = 'en' }) {
  const howItWorks = t(product.howItWorks, lang);
  const scenarios = t(product.scenarios, lang);

  return (
    <div className="space-y-6">
      {/* How It Works — step cards */}
      <Section title={strings.howItWorks}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {howItWorks.map((step) => (
            <div key={step.step} className="bg-bg-surface border border-bg-border rounded-lg p-5">
              <div className="w-7 h-7 rounded-full border border-bg-border-light flex items-center justify-center text-xs font-mono font-semibold text-text-muted mb-3">
                {step.step}
              </div>
              <div className="text-sm font-medium text-text mb-2">{step.title}</div>
              <p className="text-xs text-text-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Simplified Payoff Diagram (no advanced controls) */}
      <Section title={strings.payoffDiagram}>
        <PayoffDiagram product={product} strings={strings} showControls={false} />
      </Section>

      {/* Scenario Cards */}
      <Section title={strings.scenarios}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((sc) => {
            const colors = {
              bull: 'border-l-emerald-500',
              base: 'border-l-blue-400',
              bear: 'border-l-amber-400',
              worst: 'border-l-red-400',
            };
            return (
              <div
                key={sc.name}
                className={`bg-bg-surface border border-bg-border border-l-2 ${colors[sc.name]} rounded-lg p-4`}
              >
                <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                  {strings[`scenario${sc.name.charAt(0).toUpperCase() + sc.name.slice(1)}`]}
                </div>
                <p className="text-xs text-text-secondary mb-2">{sc.description}</p>
                <p className="text-xs text-text-muted leading-relaxed">{sc.outcome}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Underlying Assets */}
      <Section title={strings.underlyingAssets}>
        <div className="flex flex-wrap gap-4">
          {product.underliers.map((u) => (
            <div key={u.ticker} className="bg-bg-surface border border-bg-border rounded-lg px-5 py-4 text-center min-w-[120px]">
              <div className="text-base font-mono font-semibold text-text">{u.ticker}</div>
              <div className="text-xs text-text-muted mt-0.5">{u.name}</div>
              <div className="text-2xs text-text-ghost mt-1">
                ${u.initialLevel.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Key Dates */}
      <Section title={strings.keyDates}>
        <div className="flex gap-8">
          <DateItem label="Trade Date" value={product.tradeDate} />
          <DateItem label="Maturity" value={product.maturityDate} />
          <DateItem label="Tenor" value={`${product.tenor} ${strings.months}`} />
          {product.autocall?.enabled && (
            <DateItem label="First Autocall" value={`Month ${product.autocall.startMonth}`} />
          )}
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

function DateItem({ label, value }) {
  return (
    <div>
      <div className="text-xs text-text-ghost mb-0.5">{label}</div>
      <div className="text-sm font-medium text-text">{value}</div>
    </div>
  );
}
