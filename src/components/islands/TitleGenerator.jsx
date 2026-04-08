import React, { useEffect, useMemo, useRef, useState } from 'react';

function downloadTextFile({ filename, content }) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const TONES_ES = [
  { label: '👔 Formal', value: 'Formal' },
  { label: '😊 Amistoso', value: 'Friendly' },
  { label: '😎 Informal', value: 'Informal' },
  { label: '💼 Profesional', value: 'Professional' },
  { label: '💛 Diplomático', value: 'Diplomatic' },
  { label: '💪 Seguro', value: 'Confident' },
  { label: '📖 Educación secundaria', value: 'High school level' },
  { label: '🎓 Académico', value: 'Academic' },
  { label: '📚 Simplificado', value: 'Simplified' },
  { label: '🦄 Vívido', value: 'Vivid' },
  { label: '😊 Empático', value: 'Empathetic' },
  { label: '💎 Comercial', value: 'Commercial' },
  { label: '✨ Atractivo', value: 'Engaging' },
  { label: '➡️ Directo', value: 'Direct' },
  { label: '🎯 Persuasivo', value: 'Persuasive' },
];

const TONES_EN = [
  { label: '👔 Formal', value: 'Formal' },
  { label: '😊 Friendly', value: 'Friendly' },
  { label: '😎 Informal', value: 'Informal' },
  { label: '💼 Professional', value: 'Professional' },
  { label: '💛 Diplomatic', value: 'Diplomatic' },
  { label: '💪 Confident', value: 'Confident' },
  { label: '📖 High school level', value: 'High school level' },
  { label: '🎓 Academic', value: 'Academic' },
  { label: '📚 Simplified', value: 'Simplified' },
  { label: '🦄 Vivid', value: 'Vivid' },
  { label: '😊 Empathetic', value: 'Empathetic' },
  { label: '💎 Commercial', value: 'Commercial' },
  { label: '✨ Engaging', value: 'Engaging' },
  { label: '➡️ Direct', value: 'Direct' },
  { label: '🎯 Persuasive', value: 'Persuasive' },
];

export default function TitleGenerator({ lang = 'es', apiPath = '/api/generar-titulos' }) {
  const labels = useMemo(() => {
    if (lang === 'en') {
      return {
        title: 'Free AI SEO Title Generator',
        subtitle: 'Generate SEO-optimized blog titles in seconds (keep your keyword, pick a tone, export instantly).',
        keyword: 'Keyword',
        topic: 'Topic',
        language: 'Output language',
        tone: 'Writing tone',
        generate: 'Generate titles',
        generating: 'Generating...',
        output: 'Output',
        copy: 'Copy',
        download: 'Download .txt',
        reset: 'Reset',
        copied: 'Copied',
        errorMissingKeyword: 'Please enter a keyword.',
        errorMissingTopic: 'Please enter a topic.',
        errorApi: 'Could not generate titles. Try again.',
        keywordPlaceholder: 'e.g. web design company in USA',
        topicPlaceholder: 'e.g. How to choose a web design agency',
        outputPlaceholder: 'Your generated titles will appear here...',
        inputs: 'Inputs',
      };
    }

    return {
      title: 'Generador AI de Títulos SEO',
      subtitle: 'Genera títulos optimizados para SEO en segundos (mantén tu keyword, elige un tono y exporta).',
      keyword: 'Palabra clave',
      topic: 'Tema',
      language: 'Idioma de salida',
      tone: 'Tono de escritura',
      generate: 'Generar títulos',
      generating: 'Generando...',
      output: 'Resultado',
      copy: 'Copiar',
      download: 'Descargar .txt',
      reset: 'Limpiar',
      copied: 'Copiado',
      errorMissingKeyword: 'Escribe una palabra clave.',
      errorMissingTopic: 'Escribe un tema.',
      errorApi: 'No se pudo generar los títulos. Intenta de nuevo.',
      keywordPlaceholder: 'ej: empresa de diseño web en USA',
      topicPlaceholder: 'ej: cómo elegir una agencia de diseño web',
      outputPlaceholder: 'Aquí aparecerán tus títulos...',
      inputs: 'Datos',
    };
  }, [lang]);

  const [keyword, setKeyword] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Formal');
  const [outputLang, setOutputLang] = useState(lang === 'en' ? 'en' : 'es');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [titles, setTitles] = useState('');
  const [copied, setCopied] = useState(false);

  const turnstileSiteKey = typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_TURNSTILE_SITE_KEY : undefined;
  const shouldUseTurnstile = Boolean(turnstileSiteKey) && typeof import.meta !== 'undefined' && !import.meta.env?.DEV;
  const turnstileRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    if (!shouldUseTurnstile) return;
    if (!turnstileRef.current) return;

    const ensureScript = () => {
      if (document.querySelector('script[data-turnstile-script="true"]')) return;
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.dataset.turnstileScript = 'true';
      document.head.appendChild(s);
    };

    ensureScript();

    const tryRender = () => {
      if (!window.turnstile) return false;
      if (turnstileWidgetIdRef.current !== null) return true;

      turnstileWidgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => setTurnstileToken(String(token || '')),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });

      return true;
    };

    const iv = window.setInterval(() => {
      const ok = tryRender();
      if (ok) window.clearInterval(iv);
    }, 250);

    return () => {
      window.clearInterval(iv);
      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [shouldUseTurnstile]);

  async function onGenerate(e) {
    e.preventDefault();
    setCopied(false);
    setError('');

    const k = keyword.trim();
    if (!k) {
      setError(labels.errorMissingKeyword);
      return;
    }

    const t = topic.trim();
    if (!t) {
      setError(labels.errorMissingTopic);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang: outputLang,
          keyword: k,
          topic: t,
          tone,
          turnstileToken,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const serverMsg = typeof data?.error === 'string' ? data.error : '';
        const detailsMsg = typeof data?.details === 'string' ? data.details : '';
        setError(detailsMsg || serverMsg || labels.errorApi);
        return;
      }

      if (!data?.titles) {
        setError(labels.errorApi);
        return;
      }

      setTitles(String(data.titles));
    } catch {
      setError(labels.errorApi);
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    if (!titles) return;
    try {
      await navigator.clipboard.writeText(titles);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  function onDownload() {
    if (!titles) return;
    const safe = (keyword || 'titles').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    downloadTextFile({
      filename: `titles-${safe || 'seo'}.txt`,
      content: titles,
    });
  }

  function onReset() {
    setKeyword('');
    setTopic('');
    setTone('Formal');
    setTitles('');
    setError('');
    setCopied(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-36 md:pt-40 pb-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{labels.title}</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{labels.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={onGenerate} className="rounded-2xl border border-black/10 bg-white text-black shadow-sm overflow-hidden">
          <div className="bg-[#2f30f7] text-white px-5 py-4">
            <h2 className="text-lg font-semibold">{labels.inputs}</h2>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">{labels.keyword}</label>
              <input
                className="w-full rounded-xl border border-black/20 bg-white px-4 py-3"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={labels.keywordPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{labels.topic}</label>
              <input
                className="w-full rounded-xl border border-black/20 bg-white px-4 py-3"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={labels.topicPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{labels.language}</label>
              <select
                className="w-full rounded-xl border border-black/20 bg-white px-4 py-3"
                value={outputLang}
                onChange={(e) => setOutputLang(e.target.value)}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{labels.tone}</label>
              <select
                className="w-full rounded-xl border border-black/20 bg-white px-4 py-3"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                {(lang === 'en' ? TONES_EN : TONES_ES).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {shouldUseTurnstile ? (
              <div>
                <div ref={turnstileRef} />
              </div>
            ) : null}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-primary text-black px-6 py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {loading ? labels.generating : labels.generate}
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center rounded-full border border-black/20 px-6 py-3 font-semibold hover:bg-black/[0.03] transition-colors"
              >
                {labels.reset}
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-black/10 bg-white text-black shadow-sm overflow-hidden">
          <div className="bg-[#2f30f7] text-white px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-semibold">{labels.output}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  disabled={!titles}
                  aria-label={lang === 'en' ? 'Copy titles to clipboard' : 'Copiar títulos al portapapeles'}
                  title={lang === 'en' ? 'Copy to clipboard' : 'Copiar'}
                  className="px-3 py-2 sm:px-4 rounded-full text-sm font-semibold border border-white/60 text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f30f7] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? labels.copied : labels.copy}
                </button>
                <button
                  type="button"
                  onClick={onDownload}
                  disabled={!titles}
                  aria-label={lang === 'en' ? 'Download titles as a text file' : 'Descargar títulos como archivo de texto'}
                  title={lang === 'en' ? 'Download .txt' : 'Descargar .txt'}
                  className="px-3 py-2 sm:px-4 rounded-full text-sm font-semibold border border-white/60 text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f30f7] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {labels.download}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <textarea
              readOnly
              className="w-full min-h-[420px] rounded-xl border border-black/20 bg-white px-4 py-3 font-mono text-sm"
              value={titles}
              placeholder={labels.outputPlaceholder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
