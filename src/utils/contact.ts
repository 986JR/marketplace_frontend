export const normalizePhoneNumber = (value?: string | null) => {
  if (!value) return '';
  return value.replace(/[^\d+]/g, '');
};

export const toTelHref = (value?: string | null) => {
  const normalized = normalizePhoneNumber(value);
  return normalized ? `tel:${normalized}` : '';
};

export const toWhatsAppHref = (value?: string | null, text?: string) => {
  if (!value) return '';
  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) return '';
  if (!text) return `https://wa.me/${digitsOnly}`;
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(text)}`;
};

export const ensureExternalUrl = (value?: string | null) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};
