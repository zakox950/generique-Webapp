"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ShowcaseSite } from "@/lib/showcase";
import Lightbox from "@/components/ui/Lightbox";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Work({ sites }: { sites: ShowcaseSite[] }) {
  const [active, setActive] = useState<ShowcaseSite | null>(null);

  return (
    <section id="projects">
      <div className="section">
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
          >
            Réalisations<span className="orange">.</span>
          </motion.h2>
          <a href="#contact" className="section-link">Nouveau projet ↗</a>
        </div>

        {sites.length === 0 ? (
          <div className="showcase-empty">
            Aucun site pour le moment — déposez un dossier dans{" "}
            <code>public/showcase/</code>.
          </div>
        ) : (
          <div className="showcase-grid">
            {sites.map((site, i) => (
              <motion.article
                key={site.slug}
                className={`showcase-card${i === 0 ? " is-feature" : ""}`}
                style={{ ["--card-accent" as string]: site.accent }}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                onClick={() => setActive(site)}
                role="button"
                tabIndex={0}
                aria-label={`Ouvrir ${site.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(site);
                  }
                }}
              >
                <div className="showcase-frame">
                  <iframe
                    className="showcase-preview"
                    src={site.url}
                    title={site.title}
                    loading="lazy"
                    tabIndex={-1}
                    aria-hidden="true"
                    scrolling="no"
                  />
                  <div className="showcase-veil" />
                  <span className="showcase-open">Ouvrir ↗</span>
                </div>

                <div className="showcase-meta">
                  <div className="showcase-titles">
                    <div className="showcase-cat">{site.category}</div>
                    <h3 className="showcase-name">{site.title}</h3>
                    {site.description && (
                      <p className="showcase-desc">{site.description}</p>
                    )}
                  </div>
                  <div className="showcase-tags">
                    {site.tags.slice(0, 3).map((t) => (
                      <span className="showcase-tag" key={t}>{t}</span>
                    ))}
                    <span className="showcase-year">{site.year}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {active && <Lightbox site={active} onClose={() => setActive(null)} />}
    </section>
  );
}
