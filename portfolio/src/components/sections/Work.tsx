"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ShowcaseSite } from "@/lib/showcase";
import Lightbox from "@/components/ui/Lightbox";

const ease = [0.16, 1, 0.3, 1] as const;

function ShowcaseEntry({
  site,
  index,
  onOpen,
}: {
  site: ShowcaseSite;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      ref={ref}
      className="showcase-entry"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`Ouvrir ${site.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      {/* ── Text side ── */}
      <div className="showcase-entry-left">
        <div className="showcase-entry-head">
          <span className="showcase-entry-num">{num}</span>
          <span className="showcase-entry-cat">{site.category}</span>
          <span className="showcase-entry-year">{site.year}</span>
        </div>

        <h3 className="showcase-entry-title">{site.title}</h3>

        {site.description && (
          <p className="showcase-entry-desc">{site.description}</p>
        )}

        <div className="showcase-entry-tags">
          {site.tags.slice(0, 4).map((t) => (
            <span className="showcase-entry-tag" key={t}>{t}</span>
          ))}
        </div>

        <div className="showcase-entry-cta" aria-hidden="true">
          Ouvrir le projet →
        </div>
      </div>

      {/* ── Preview panel — 3D tilt, turns to face on hover ── */}
      <div className="showcase-entry-preview">
        <div className="showcase-entry-preview-inner">
          <div className="showcase-iframe-wrap">
            {inView && (
              <iframe
                className="showcase-preview-iframe"
                src={site.url}
                title={site.title}
                loading="lazy"
                tabIndex={-1}
                aria-hidden="true"
                scrolling="no"
              />
            )}
          </div>
          <div className="showcase-preview-veil" />
        </div>
      </div>
    </motion.li>
  );
}

export default function Work({ sites }: { sites: ShowcaseSite[] }) {
  const [active, setActive] = useState<ShowcaseSite | null>(null);

  return (
    <section id="projects">
      <div className="section">
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease }}
          >
            Réalisations
          </motion.h2>
          <a href="#contact" className="section-link">Nouveau projet ↗</a>
        </div>

        {sites.length === 0 ? (
          <div className="showcase-empty">
            Aucune réalisation pour le moment — déposez un dossier dans{" "}
            <code>public/showcase/</code>.
          </div>
        ) : (
          <ul className="showcase-list">
            {sites.map((site, i) => (
              <ShowcaseEntry
                key={site.slug}
                site={site}
                index={i}
                onOpen={() => setActive(site)}
              />
            ))}
          </ul>
        )}
      </div>

      {active && <Lightbox site={active} onClose={() => setActive(null)} />}
    </section>
  );
}
