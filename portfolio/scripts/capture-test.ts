/**
 * Test manuel du moteur de capture (phase 3) — aucune base de données.
 * Usage : npm run capture:test -- <url> [slug]
 */
import "dotenv/config";
import { capture } from "@/lib/capture";
import { storageRoot, VARIANTS, absoluteFor, type Variant } from "@/lib/storage";
import { promises as fs } from "node:fs";

async function main() {
  const url = process.argv[2] || "https://example.com";
  const slug = process.argv[3] || "example";

  console.log(`[capture-test] cible ${url} → slug "${slug}"`);
  console.log(`[capture-test] storage = ${storageRoot()}`);
  const t0 = Date.now();

  await capture(url, slug);

  console.log(`[capture-test] terminé en ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  for (const v of VARIANTS) {
    const p = absoluteFor(slug, v as Variant);
    const stat = await fs.stat(p).catch(() => null);
    console.log(
      stat
        ? `  ✓ ${v.padEnd(16)} ${(stat.size / 1024).toFixed(0)} Ko`
        : `  ✗ ${v} MANQUANT`,
    );
  }
}

main().catch((err) => {
  console.error("[capture-test] ÉCHEC:", err);
  process.exit(1);
});
