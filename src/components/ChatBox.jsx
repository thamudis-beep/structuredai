import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function ChatBox({ strings: s, product, mode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Build context string from current state
  const buildContext = useCallback(() => {
    const parts = [`User is viewing: ${mode} mode`];

    if (product) {
      parts.push(`Product: ${product.productType} issued by ${product.issuer}`);
      parts.push(`Underliers: ${product.underliers.map((u) => `${u.ticker} (${u.name})`).join(', ')}`);
      parts.push(`Coupon: ${(product.coupon.rate * 100).toFixed(1)}% ${product.coupon.frequency}, ${product.coupon.type}${product.coupon.memory ? ' with memory' : ''}`);
      parts.push(`Barrier: ${(product.barrier.level * 100).toFixed(0)}% ${product.barrier.type}`);
      parts.push(`Tenor: ${product.tenor} months`);
      parts.push(`Notional: $${(product.notional / 1e6).toFixed(1)}M`);
      if (product.autocall?.enabled) {
        parts.push(`Autocall: ${(product.autocall.triggerLevel * 100).toFixed(0)}% trigger, ${product.autocall.frequency} from month ${product.autocall.startMonth}`);
      }
      parts.push(`Summary: ${product.summary}`);
    }

    return parts.join('\n');
  }, [product, mode]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: buildContext(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.message}. Please try again.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Suggested questions based on mode
  const suggestions = mode === 'intro'
    ? [s.chatSuggestIntro1, s.chatSuggestIntro2, s.chatSuggestIntro3]
    : mode === 'fa'
      ? [s.chatSuggestFA1, s.chatSuggestFA2, s.chatSuggestFA3]
      : [s.chatSuggestClient1, s.chatSuggestClient2, s.chatSuggestClient3];

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          open
            ? 'bg-bg-surface border border-bg-border-light text-text-muted hover:text-text'
            : 'bg-text text-bg hover:opacity-90'
        }`}
        title={s.chatTitle}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-h-[520px] bg-bg border border-bg-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border">
            <div>
              <div className="text-xs font-medium text-text">{s.chatTitle}</div>
              <div className="text-2xs text-text-ghost">{s.chatSubtitle}</div>
            </div>
            <button
              onClick={clearChat}
              className="text-2xs text-text-ghost hover:text-text-muted transition-all px-2 py-1 rounded hover:bg-bg-surface"
              title={s.chatClear}
            >
              {s.chatClear}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[340px]">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-text-ghost">{s.chatEmpty}</p>
                <div className="space-y-1.5 mt-3">
                  {suggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      className="block w-full text-left px-3 py-2 text-xs text-text-muted bg-bg-surface border border-bg-border rounded-lg hover:border-bg-border-light transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-bg-surface border border-bg-border text-text'
                        : 'bg-bg border border-bg-border/50 text-text-secondary'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-bg border border-bg-border/50">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-text-ghost animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-text-ghost animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-text-ghost animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-bg-border px-3 py-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={s.chatPlaceholder}
                disabled={loading}
                className="flex-1 bg-bg-surface border border-bg-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-ghost outline-none focus:border-bg-border-light transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  input.trim() && !loading
                    ? 'bg-text text-bg hover:opacity-90'
                    : 'bg-bg-surface text-text-ghost border border-bg-border cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
