import { chromium, devices, type Browser } from "playwright";
import sharp from "sharp";
import { writeVariant, type Variant } from "@/lib/storage";

/**
 * Moteur de capture PUR : prend une URL + un slug, produit 4 fichiers WebP
 * (desktop/mobile × preview/full) sous STORAGE_DIR/<slug>/.
 *
 * Aucune logique de statut ni d'accès base ici — c'est le worker (phase 5)
 * qui orchestre PENDING → CAPTURING → CACHED/FAILED autour de cet appel.
 * Toute erreur (navigation, timeout) remonte telle quelle à l'appelant.
 */

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = devices["iPhone 13"]; // ~390x844, deviceScaleFactor 3, mobile

const NAV_TIMEOUT_MS = 30_000;
const WEBP_QUALITY = 82;

async function pngToWebp(png: Buffer): Promise<Buffer> {
  return sharp(png).webp({ quality: WEBP_QUALITY }).toBuffer();
}

async function captureViewport(
  browser: Browser,
  url: string,
  slug: string,
  opts: {
    previewVariant: Variant;
    fullVariant: Variant;
    contextOptions: Parameters<Browser["newContext"]>[0];
  },
): Promise<void> {
  const context = await browser.newContext({
    ...opts.contextOptions,
    // Réduit le bruit (bannières cookies animées, autoplay) sans bloquer le rendu.
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  try {
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: NAV_TIMEOUT_MS,
    });
    // Laisse les polices / images au-dessus de la ligne de flottaison se poser.
    await page.waitForTimeout(800);

    // Preview = above-the-fold (viewport courant, pas fullPage).
    const previewPng = await page.screenshot({ type: "png", fullPage: false });
    await writeVariant(slug, opts.previewVariant, await pngToWebp(previewPng));

    // Full = page entière.
    const fullPng = await page.screenshot({ type: "png", fullPage: true });
    await writeVariant(slug, opts.fullVariant, await pngToWebp(fullPng));
  } finally {
    await context.close();
  }
}

export async function capture(url: string, slug: string): Promise<void> {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    // Séquentiel : un seul onglet lourd à la fois (borne mémoire VPS).
    await captureViewport(browser, url, slug, {
      previewVariant: "desktop-preview",
      fullVariant: "desktop-full",
      contextOptions: { viewport: DESKTOP, deviceScaleFactor: 1 },
    });
    await captureViewport(browser, url, slug, {
      previewVariant: "mobile-preview",
      fullVariant: "mobile-full",
      contextOptions: { ...MOBILE },
    });
  } finally {
    await browser.close();
  }
}
