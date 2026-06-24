"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import type { ShowcaseSite } from "@/lib/showcase";
import Lightbox from "@/components/ui/Lightbox";

const ease = [0.16, 1, 0.3, 1] as const;

// Fan levels by absolute distance from the active card. Sign (left/right)
// is applied at render time so cards spread symmetrically around the center.
const LEVELS = [
  { dx: 0,   dr: 0,  scale: 1,    opacity: 1    }, // active — upright, on top
  { dx: 215, dr: 8,  scale: 0.93, opacity: 0.78 },
  { dx: 360, dr: 14, scale: 0.86, opacity: 0.46 },
  { dx: 460, dr: 18, scale: 0.80, opacity: 0.24 },
];

export default function Work({ sites }: { sites: ShowcaseSite[] }) {
  const [active, setActive] = useState(0);
  const [spread, setSpread] = useState(1); // responsive fan-width multiplier
  const [lightbox, setLightbox] = useState<ShowcaseSite | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  const n = sites.length;

  // Scroll-driven expansion: stage grows as the section enters the viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.88", "start 0.15"],
  });
  const stageScale = useTransform(scrollYProgress, [0, 1], [0.72, 1.0]);

  // Looping navigation.
  const prev = () => setActive((i) => (i - 1 + n) % n);
  const next = () => setActive((i) => (i + 1) % n);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSpread(w < 560 ? 0.42 : w < 900 ? 0.68 : w < 1180 ? 0.85 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!n) {
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
      <div className="section section--wide">
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

        {/* Stacked card deck — circular fan */}
        <motion.div
          className="deck-stage-wrap"
          style={{ scale: stageScale }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          {sites.map((site, i) => {
            // Shortest circular distance from the active card.
            let off = i - active;
            if (off > n / 2) off -= n;
            if (off < -n / 2) off += n;

            const mag = Math.abs(off);
            const dir = Math.sign(off);
            const lv = LEVELS[Math.min(mag, LEVELS.length - 1)];
            const isActive = off === 0;

            return (
              <motion.div
                key={site.slug}
                className={`deck-card${isActive ? " active" : ""}`}
                style={{ zIndex: 30 - mag }}
                animate={{
                  x: dir * lv.dx * spread,
                  y: mag * 12,
                  rotate: dir * lv.dr,
                  scale: lv.scale,
                  opacity: lv.opacity,
                }}
                transition={{ duration: 0.55, ease }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) next();
                  else if (info.offset.x > 80) prev();
                }}
                onClick={() => {
                  if (!isActive) setActive(i);
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightbox(site);
                      }}
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
            {String(n).padStart(2, "0")}
          </span>

          {/* Arrow buttons — loop, never disabled */}
          <div className="deck-arrows">
            <button
              className="deck-arrow-btn"
              onClick={prev}
              aria-label="Projet précédent"
            >
              ←
            </button>
            <button
              className="deck-arrow-btn"
              onClick={next}
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
