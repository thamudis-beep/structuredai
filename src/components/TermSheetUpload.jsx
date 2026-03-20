import React, { useState, useRef } from 'react';

export default function TermSheetUpload({ strings, onFileSelect, onDemo }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') onFileSelect(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Logo / title */}
      <h2 className="text-3xl font-serif text-text tracking-tight mb-1">{strings.appName}</h2>
      <p className="text-sm text-text-muted mb-10">{strings.subtitle}</p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`w-full max-w-md border-2 border-dashed rounded-xl p-10 flex flex-col items-center cursor-pointer transition-all ${
          dragging
            ? 'border-text/40 bg-bg-surface'
            : 'border-bg-border hover:border-bg-border-light hover:bg-bg-surface/50'
        }`}
      >
        {/* Upload icon */}
        <svg className="w-10 h-10 text-text-ghost mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="text-sm font-medium text-text mb-1">{strings.upload}</p>
        <p className="text-xs text-text-muted text-center">{strings.uploadSub}</p>
        <p className="text-2xs text-text-ghost mt-3 text-center">{strings.uploadHint}</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Demo button */}
      <button
        onClick={onDemo}
        className="mt-6 text-xs text-text-muted hover:text-text border border-bg-border hover:border-bg-border-light rounded-md px-4 py-2 transition-all"
      >
        {strings.tryDemo}
      </button>
    </div>
  );
}
