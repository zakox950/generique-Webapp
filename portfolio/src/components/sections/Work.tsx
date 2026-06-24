"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import type { ShowcaseSite } from "@/lib/showcase";
import Lightbox from "@/components/ui/Lightbox";

const ease = [0.16, 1, 0.3, 1] as const;

// Fan layout — active card upright/centered on top, others fanned out
// left & right behind it like a hand of playing cards.
const STACK = [
  { x: 0,    y: 0,  rotate: 0,    scale: 1,    opacity: 1,    zIndex: 30 },
  { x: 104,  y: 16, rotate: 7,    scale: 0.95, opacity: 0.82, zIndex: 29 },
  { x: -96,  y: 24, rotate: -8,   scale: 0.91, opacity: 0.56, zIndex: 28 },
  { x: 168,  y: 38, rotate: 13,   scale: 0.87, opacity: 0.30, zIndex: 27 },
];

export default function Work({ sites }: { sites: ShowcaseSite[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<ShowcaseSite | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.10 });

  // Scroll-driven expansion: stage grows from 0.72 → 1 as section enters viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.88", "start 0.15"],
  });
  const stageScale = useTransform(scrollYProgress, [0, 1], [0.72, 1.0]);

  const prev = () => setActive((i) => Math.max(0, i - 1));
  const next = () => setActive((i) => Math.min(sites.length - 1, i + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!sites.length) {
    return (
      <section id="projects">
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Réalisations</h2>
          </div>
          <p className="showcase-empty">
            Aucune réalisation — déposez un dossier dans{" "}
            <code>public/showcase/</code>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef}>
      <div className="section">
        {/* Header */}
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

        {/* Stacked card deck */}
        <motion.div
          className="deck-stage-wrap"
          style={{ scale: stageScale }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          {sites.map((site, i) => {
            const offset = i - active;
            // Only render: active card + up to 3 behind (never already-seen cards)
            if (offset < 0 || offset > 3) return null;

            const s = STACK[Math.min(offset, STACK.length - 1)];
            const isActive = offset === 0;

            return (
              <motion.div
                key={site.slug}
                className={`deck-card${isActive ? " active" : ""}`}
                style={{ zIndex: s.zIndex }}
                animate={{
                  x: s.x,
                  y: s.y,
                  rotate: s.rotate,
                  scale: s.scale,
                  opacity: s.opacity,
                }}
                transition={{ duration: 0.55, ease }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) next();
                  else if (info.offset.x > 80) prev();
                }}
              >
                {/* Website preview */}
                <div className="deck-card-preview">
                  {inView && (
                    <iframe
                      className="deck-card-iframe"
                      src={site.url}
                      title={site.title}
                      loading="lazy"
                      tabIndex={-1}
                      aria-hidden="true"
                      scrolling="no"
                    />
                  )}
                </div>

                {/* Glass info panel */}
                <div className="deck-card-info">
                  <span className="deck-card-cat">
                    {site.category} · {site.year}
                  </span>
                  <h3 className="deck-card-title">{site.title}</h3>
                  {site.description && (
                    <p className="deck-card-desc">{site.description}</p>
                  )}
                  {isActive && (
                    <button
                      className="deck-card-open"
                      onClick={() => setLightbox(site)}
                    >
                      Ouvrir le projet ↗
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation */}
        <div className="deck-controls">
          {/* Dot indicators */}
          <div className="deck-dots" role="tablist" aria-label="Projets">
            {sites.map((_, i) => (
              <button
                key={i}
                className={`deck-dot${i === active ? " active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Projet ${i + 1}`}
                role="tab"
                aria-selected={i === active}
              />
            ))}
          </div>

          <span className="deck-counter" aria-live="polite">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(sites.length).padStart(2, "0")}
          </span>

          {/* Arrow buttons */}
          <div className="deck-arrows">
            <button
              className="deck-arrow-btn"
              onClick={prev}
              disabled={active === 0}
              aria-label="Projet précédent"
            >
              ←
            </button>
            <button
              className="deck-arrow-btn"
              onClick={next}
              disabled={active === sites.length - 1}
              aria-label="Projet suivant"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox site={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
