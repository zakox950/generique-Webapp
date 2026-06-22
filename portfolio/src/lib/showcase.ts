import fs from "node:fs";
import path from "node:path";

export interface ShowcaseSite {
  /** Folder name under public/showcase — also the public URL segment */
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  /** Accent color (any CSS color) used for the card hover glow */
  accent: string;
  /** Sort weight — lower comes first. Defaults to 999. */
  order: number;
  /** Public path served by Next from /public */
  url: string;
}

const SHOWCASE_DIR = path.join(process.cwd(), "public", "showcase");

/**
 * Reads every folder under public/showcase that contains an index.html.
 * Each folder may include a meta.json to describe the site; missing fields
 * fall back to sensible defaults derived from the folder name.
 *
 * Drop a new folder (index.html + optional meta.json) and it appears here
 * automatically on the next build.
 */
export function getShowcaseSites(): ShowcaseSite[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(SHOWCASE_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const sites: ShowcaseSite[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const dir = path.join(SHOWCASE_DIR, slug);

    if (!fs.existsSync(path.join(dir, "index.html"))) continue;

    let meta: Partial<ShowcaseSite> = {};
    const metaPath = path.join(dir, "meta.json");
    if (fs.existsSync(metaPath)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      } catch {
        meta = {};
      }
    }

    sites.push({
      slug,
      title: meta.title ?? prettify(slug),
      category: meta.category ?? "Projet",
      year: meta.year ?? "2026",
      description: meta.description ?? "",
      tags: meta.tags ?? [],
      accent: meta.accent ?? "#F97316",
      order: meta.order ?? 999,
      url: `/showcase/${slug}/index.html`,
    });
  }

  return sites.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

function prettify(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
