"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  /* Layered parallax — photo lags, orbs drift, deco lingers, content leads */
  const photoY         = useTransform(scrollY, [0, 1000], [0, 170]);
  const orbsY          = useTransform(scrollY, [0, 1000], [0, 130]);
  const contentY       = useTransform(scrollY, [0, 1000], [0, 70]);
  const contentOpacity = useTransform(scrollY, [260, 720], [1, 0]);

  /* Spyfie backdrop word: lingers (drifts down to fight page scroll),
     spreads its letters apart and fades — clearly readable on scroll. */
  const decoY             = useTransform(scrollY, [0, 800], [0, 260]);
  const rawGap            = useTransform(scrollY, [0, 560], [0.04, 0.9]);
  const decoLetterSpacing = useMotionTemplate`${rawGap}em`;
  const decoOpacity       = useTransform(scrollY, [40, 640], [0.42, 0]);

  return (
    <section className="hero" id="home" ref={heroRef}>
      {/* ── Layer 0 — real jungle photograph (darkened to stay readable) ── */}
      <motion.div style={{ y: photoY }} className="hero-photo" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/flora/jungle.webp" alt="" loading="eager" />
      </motion.div>

      {/* ── Layer 1 — atmosphere orbs (ambient) ── */}
      <motion.div style={{ y: orbsY }} className="hero-layer" aria-hidden="true">
        <div className="hero-atmo">
          <div className="atmo-orb atmo-orb-1" />
          <div className="atmo-orb atmo-orb-2" />
          <div className="atmo-orb atmo-orb-3" />
        </div>
      </motion.div>

      {/* ── Layer 2 — giant "Spyfie" backdrop, scroll-animated ── */}
      <motion.div
        style={{ position: "absolute", inset: 0, y: decoY, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <motion.div
          className="hero-deco"
          style={{ letterSpacing: decoLetterSpacing, opacity: decoOpacity }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          {["S", "p", "y", "f", "i", "e"].map((char, i) => (
            <motion.span
              key={i}
              style={{ display: "inline-block" }}
              initial={{ opacity: 0, y: 55, filter: "blur(22px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Layer 3 — foreground content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, position: "relative", zIndex: 2 }}
      >
        <motion.p
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="dot-pulse" />
          Studio digital — disponible
        </motion.p>

        <motion.h1
          className="hero-brand-name"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease }}
        >
          Spy<span className="tan-char">fie</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease }}
        >
          Studio de développement web sur-mesure
        </motion.p>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42, ease }}
        >
          <p className="hero-tagline">
            On construit des produits web qui tiennent.<br />
            Précision artisanale, livraisons sans détour.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">Voir les projets →</a>
            <a href="#contact" className="btn-ghost">Démarrer</a>
          </div>
        </motion.div>
      </motion.div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span>scroll</span>
        <div className="scroll-track">
          <div className="scroll-bar" />
        </div>
      </div>
    </section>
  );
}
