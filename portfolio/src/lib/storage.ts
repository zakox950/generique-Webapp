import path from "node:path";
import { promises as fs } from "node:fs";

/**
 * Source unique de la convention de nommage et de résolution des chemins
 * de captures. Aucune route ni aucun service ne doit reconstruire un chemin
 * à la main — tout passe par ici (évite le path traversal et garde une seule
 * vérité sur l'arborescence de stockage).
 *
 * Arborescence : STORAGE_DIR/<slug>/<variant>.webp
 * Le full-page est une variante dérivée, pas une colonne en base.
 */

export const VARIANTS = [
  "desktop-preview",
  "mobile-preview",
  "desktop-full",
  "mobile-full",
] as const;

export type Variant = (typeof VARIANTS)[number];

export function isVariant(value: string): value is Variant {
  return (VARIANTS as readonly string[]).includes(value);
}

/** Racine de stockage (volume local en dev, volume monté en prod). */
export function storageRoot(): string {
  const dir = process.env.STORAGE_DIR || "./data/shots";
  return path.resolve(process.cwd(), dir);
}

function filenameFor(variant: Variant): string {
  return `${variant}.webp`;
}

/** Chemin relatif stocké/servi (ex. "mon-site/desktop-preview.webp"). */
export function relativeFor(slug: string, variant: Variant): string {
  return `${slug}/${filenameFor(variant)}`;
}

/** Chemin absolu sur le disque. */
export function absoluteFor(slug: string, variant: Variant): string {
  return path.join(storageRoot(), slug, filenameFor(variant));
}

/** Valeurs à stocker dans Target.desktopShot / Target.mobileShot (previews). */
export function previewShots(slug: string): {
  desktopShot: string;
  mobileShot: string;
} {
  return {
    desktopShot: relativeFor(slug, "desktop-preview"),
    mobileShot: relativeFor(slug, "mobile-preview"),
  };
}

export async function ensureTargetDir(slug: string): Promise<string> {
  const dir = path.join(storageRoot(), slug);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

/** Écrit un buffer pour une variante donnée. */
export async function writeVariant(
  slug: string,
  variant: Variant,
  data: Buffer,
): Promise<void> {
  await ensureTargetDir(slug);
  await fs.writeFile(absoluteFor(slug, variant), data);
}

/** Lit le fichier d'une variante (pour le service d'image). null si absent. */
export async function readVariant(
  slug: string,
  variant: Variant,
): Promise<Buffer | null> {
  try {
    return await fs.readFile(absoluteFor(slug, variant));
  } catch {
    return null;
  }
}

/** Supprime tout le dossier d'une cible (suppression de cible). */
export async function deleteTargetDir(slug: string): Promise<void> {
  await fs.rm(path.join(storageRoot(), slug), { recursive: true, force: true });
}
