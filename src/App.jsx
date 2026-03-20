import React, { useState, useEffect } from 'react';
import { STRINGS } from './lib/i18n';
import { SAMPLE_PRODUCT } from './lib/mock-data';
import TermSheetUpload from './components/TermSheetUpload';
import FAMode from './modules/FAMode';
import ClientMode from './modules/ClientMode';
import Introduction from './modules/Introduction';

const MODES = [
  { id: 'intro', labelKey: 'introMode' },
  { id: 'fa', labelKey: 'faMode' },
  { id: 'client', labelKey: 'clientMode' },
];

function App() {
  const [lang, setLang] = useState('en');
  const s = STRINGS[lang];

  // Dark mode — defaults to dark
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') !== 'light';
    return true;
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // App state
  const [mode, setMode] = useState('intro'); // 'intro' | 'fa' | 'client'
  const [product, setProduct] = useState(null); // StructuredProduct | null
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  // Simulated analysis progress
  useEffect(() => {
    if (!analyzing) return;
    const steps = s.analyzingSteps;
    if (analyzeStep >= steps.length) return;
    const timer = setTimeout(() => setAnalyzeStep((p) => p + 1), 1200);
    return () => clearTimeout(timer);
  }, [analyzing, analyzeStep, s]);

  const handleFileSelect = async (file) => {
    setAnalyzing(true);
    setAnalyzeStep(0);
    // TODO: POST file to /api/analyze, receive StructuredProduct JSON
    // For now, simulate with mock data after a delay
    setTimeout(() => {
      setProduct(SAMPLE_PRODUCT);
      setAnalyzing(false);
    }, 4800);
  };

  const handleDemo = () => {
    setProduct(SAMPLE_PRODUCT);
  };

  const handleNewAnalysis = () => {
    setProduct(null);
    setAnalyzing(false);
    setAnalyzeStep(0);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-bg-border/50">
        <div className="max-w-[1440px] mx-auto px-8 pt-8 pb-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-serif text-text tracking-tight">{s.appName}</h1>
              <p className="text-xs text-text-muted mt-1.5">{s.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Language toggle */}
              <div className="flex items-center border border-bg-border rounded-md overflow-hidden">
                {['en', 'es'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1.5 text-xs font-medium transition-all ${
                      lang === l
                        ? 'bg-bg-surface text-text'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text border border-bg-border hover:border-bg-border-light transition-all"
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mode tabs — always show */}
          <div className="flex gap-0.5 mt-6">
            {MODES.map((m) => {
              // FA and Client tabs disabled until product loaded
              const disabled = (m.id === 'fa' || m.id === 'client') && !product;
              return (
                <button
                  key={m.id}
                  onClick={() => !disabled && setMode(m.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-t-md transition-all ${
                    mode === m.id
                      ? 'bg-bg-surface text-text border border-bg-border border-b-bg-surface -mb-px'
                      : disabled
                        ? 'text-text-ghost/40 cursor-not-allowed'
                        : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {s[m.labelKey]}
                </button>
              );
            })}
            {product && (
              <>
                <div className="flex-1" />
                <button
                  onClick={handleNewAnalysis}
                  className="px-3 py-1.5 text-xs text-text-muted hover:text-text border border-bg-border hover:border-bg-border-light rounded-md transition-all"
                >
                  {s.newAnalysis}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Introduction mode */}
        {mode === 'intro' && (
          <Introduction strings={s} />
        )}

        {/* FA / Client modes */}
        {mode !== 'intro' && (
          <>
            {/* Upload / landing */}
            {!product && !analyzing && (
              <TermSheetUpload
                strings={s}
                onFileSelect={handleFileSelect}
                onDemo={handleDemo}
              />
            )}

            {/* Analyzing state */}
            {analyzing && (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-bg-border border-t-text rounded-full animate-spin mb-6" />
                <p className="text-sm text-text mb-3">{s.analyzing}</p>
                <div className="flex flex-col items-center gap-1">
                  {s.analyzingSteps.map((step, i) => (
                    <p
                      key={i}
                      className={`text-xs transition-all ${
                        i < analyzeStep ? 'text-text-secondary' : i === analyzeStep ? 'text-text-muted' : 'text-text-ghost/40'
                      }`}
                    >
                      {i < analyzeStep ? '\u2713' : i === analyzeStep ? '\u2022' : '\u00B7'} {step}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Product loaded */}
            {product && !analyzing && (
              <div>
                {mode === 'fa' ? (
                  <FAMode product={product} strings={s} />
                ) : (
                  <ClientMode product={product} strings={s} />
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
