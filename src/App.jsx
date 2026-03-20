import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STRINGS } from './lib/i18n';
import { SAMPLE_PRODUCT } from './lib/mock-data';
import TermSheetUpload from './components/TermSheetUpload';
import FAMode from './modules/FAMode';
import ClientMode from './modules/ClientMode';
import Introduction from './modules/Introduction';
import ChatBox from './components/ChatBox';

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

  // App state — sample product loaded by default so FA/Client always work
  const [mode, setMode] = useState('intro');
  const [product, setProduct] = useState(SAMPLE_PRODUCT);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  // Term sheet modal
  const [showTermSheetModal, setShowTermSheetModal] = useState(false);

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
    setTimeout(() => {
      setProduct(SAMPLE_PRODUCT);
      setAnalyzing(false);
      setMode('fa');
    }, 4800);
  };

  const handleDemo = () => {
    setProduct(SAMPLE_PRODUCT);
    setMode('fa');
  };

  const handleNewAnalysis = () => {
    setProduct(SAMPLE_PRODUCT);
    setAnalyzing(false);
    setAnalyzeStep(0);
  };

  const handleTermSheetSubmit = (fileOrText) => {
    // TODO: actual API call to analyze term sheet
    // For now, load sample product and switch to FA mode
    setShowTermSheetModal(false);
    setProduct(SAMPLE_PRODUCT);
    setMode('fa');
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
              {/* Analyze Term Sheet button */}
              <button
                onClick={() => setShowTermSheetModal(true)}
                className="px-3 py-1.5 text-xs font-medium text-text bg-bg-surface border border-bg-border hover:border-bg-border-light rounded-md transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {s.analyzeTermSheet}
              </button>

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

          {/* Mode tabs */}
          <div className="flex gap-0.5 mt-6">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-2 text-xs font-medium rounded-t-md transition-all ${
                  mode === m.id
                    ? 'bg-bg-surface text-text border border-bg-border border-b-bg-surface -mb-px'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {s[m.labelKey]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        {mode === 'intro' && (
          <Introduction strings={s} />
        )}

        {mode === 'fa' && (
          <FAMode product={product} strings={s} lang={lang} />
        )}

        {mode === 'client' && (
          <ClientMode product={product} strings={s} lang={lang} />
        )}
      </main>

      {/* Q&A Chat */}
      <ChatBox strings={s} product={product} mode={mode} />

      {/* Term Sheet Modal */}
      {showTermSheetModal && (
        <TermSheetModal
          strings={s}
          onClose={() => setShowTermSheetModal(false)}
          onSubmit={handleTermSheetSubmit}
        />
      )}
    </div>
  );
}

function TermSheetModal({ strings: s, onClose, onSubmit }) {
  const [pasteText, setPasteText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    } else if (pasteText.trim()) {
      onSubmit(pasteText.trim());
    }
  };

  const canSubmit = selectedFile || pasteText.trim().length > 0;

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg border border-bg-border rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-medium text-text">{s.termSheetModalTitle}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-bg-surface transition-all"
            title={s.close}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* File drop zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all mb-4 ${
            dragOver
              ? 'border-text-secondary bg-bg-surface/50'
              : selectedFile
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-bg-border hover:border-bg-border-light'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {selectedFile ? (
            <div>
              <svg className="w-6 h-6 text-emerald-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs font-medium text-text">{selectedFile.name}</div>
              <div className="text-2xs text-text-ghost mt-1">{(selectedFile.size / 1024).toFixed(0)} KB</div>
            </div>
          ) : (
            <div>
              <svg className="w-8 h-8 text-text-ghost mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-xs text-text-muted">{s.dropZoneLabel}</div>
              <div className="text-2xs text-text-ghost mt-1">{s.dropZoneHint}</div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-bg-border" />
          <span className="text-2xs text-text-ghost uppercase tracking-wider">{s.pasteLabel}</span>
          <div className="flex-1 h-px bg-bg-border" />
        </div>

        {/* Textarea */}
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={s.pasteHint}
          className="w-full h-32 bg-bg-surface border border-bg-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-ghost resize-none outline-none focus:border-bg-border-light transition-all"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text transition-all"
          >
            {s.close}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-5 py-2 text-xs font-medium rounded-md border transition-all ${
              canSubmit
                ? 'bg-bg-surface text-text border-bg-border-light hover:border-text-ghost'
                : 'text-text-ghost border-bg-border cursor-not-allowed'
            }`}
          >
            {s.analyze}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
