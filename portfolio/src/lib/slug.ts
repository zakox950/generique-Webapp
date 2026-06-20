/** Slug lisible dérivé d'une URL (hostname + chemin), borné et nettoyé. */
export function slugFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const base = (u.hostname.replace(/^www\./, "") + u.pathname).toLowerCase();
    const cleaned = base
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    return cleaned || "cible";
  } catch {
    return "cible";
  }
}

/** Normalise une URL saisie : ajoute https:// si le schéma manque. */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
