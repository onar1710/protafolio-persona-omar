import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2, Send } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LandingQuoteForm({ whatsappNumber = '573107851074', defaultSiteType = '' }) {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    siteType: defaultSiteType,
  });

  const whatsappUrl = useMemo(() => {
    const text = [
      'Hola Omar, quiero cotizar un sitio web.',
      `Nombre: ${formData.name || '-'}`,
      `Email: ${formData.email || '-'}`,
      `Teléfono: ${formData.phone || '-'}`,
      `Tipo de sitio: ${formData.siteType || '-'}`,
    ].join('\n');

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${whatsappNumber}?text=${encoded}`;
  }, [formData, whatsappNumber]);

  const validate = () => {
    const next = {};

    if (!formData.name.trim()) next.name = 'Tu nombre es obligatorio';

    if (!formData.email.trim()) next.email = 'Tu email es obligatorio';
    else if (!EMAIL_REGEX.test(formData.email)) next.email = 'Ingresa un email válido';

    if (!formData.phone.trim()) next.phone = 'Tu teléfono es obligatorio';

    if (!formData.siteType.trim()) next.siteType = 'Selecciona el tipo de sitio';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    try {
      await new Promise((r) => setTimeout(r, 600));
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="py-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Listo. Te estoy escribiendo por WhatsApp</h3>
            <p className="text-sm text-muted-foreground">
              Si no se abrió, usa el botón de abajo.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                Abrir WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Enviar otra solicitud
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted-foreground">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-foreground outline-none transition-all dark:bg-white/10 dark:text-white ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-black/10 focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10'
                }`}
                placeholder="Tu nombre"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted-foreground">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-foreground outline-none transition-all dark:bg-white/10 dark:text-white ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-black/10 focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10'
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-muted-foreground">
                Teléfono / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                inputMode="tel"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-foreground outline-none transition-all dark:bg-white/10 dark:text-white ${
                  errors.phone
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-black/10 focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10'
                }`}
                placeholder="Ej: +57 300 123 4567"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="siteType" className="mb-2 block text-sm font-medium text-muted-foreground">
                Tipo de sitio <span className="text-red-500">*</span>
              </label>
              <select
                id="siteType"
                value={formData.siteType}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-foreground outline-none transition-all dark:bg-white/10 dark:text-white ${
                  errors.siteType
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-black/10 focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10'
                }`}
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="Landing page">Landing page (captación)</option>
                <option value="Sitio corporativo">Sitio corporativo</option>
                <option value="Tienda online (eCommerce)">Tienda online (eCommerce)</option>
                <option value="Rediseño / optimización">Rediseño / optimización</option>
              </select>
              {errors.siteType && <p className="mt-1 text-xs text-red-500">{errors.siteType}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Solicitar Cotización
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-center text-xs text-red-500">
                Hubo un problema. Escríbeme directo por WhatsApp.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
