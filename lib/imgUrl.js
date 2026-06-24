/**
 * Safely extract a URL string from either:
 *   - a plain string:              "/assets/img/foo.jpg"
 *   - a Cloudinary object:         { url: "https://...", public_id: "..." }
 *   - null / undefined:            returns fallback
 */
export function imgUrl(val, fallback = '') {
  if (!val) return fallback
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val.url) return val.url
  return fallback
}
