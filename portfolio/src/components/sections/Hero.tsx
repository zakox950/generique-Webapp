"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  /* Three parallax layers — the further back, the more it lags on scroll */
  const glowY    = useTransform(scrollY, [0, 1000], [0, 340]); // slowest = deepest
  const decoY    = useTransform(scrollY, [0, 1000], [0, 200]); // mid
  const contentY = useTransform(scrollY, [0, 1000], [0, 80]);  // fastest = surface
  const contentOpacity = useTransform(scrollY, [280, 700], [1, 0]);

  return (
    <section className="hero" id="home" ref={heroRef}>

      {/* ─── Layer 1 — Background glow (slowest) ─── */}
      <motion.div
        style={{ position: "absolute", inset: 0, pointerEvents: "none", y: glowY }}
        aria-hidden="true"
      >
        <div className="hero-glow" />
      </motion.div>

      {/* ─── Layer 2 — Decorative wordmark (mid speed) ─── */}
      <motion.div
        style={{ position: "absolute", inset: 0, pointerEvents: "none", y: decoY }}
        aria-hidden="true"
      >
        <div className="hero-deco">Spyfie.</div>
      </motion.div>

      {/* ─── Layer 3 — Foreground content (fastest) ─── */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <motion.p
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          Studio digital
        </motion.p>

        <motion.h1
          className="hero-headline"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
        >
          Spyfie<span className="orange">.</span>
        </motion.h1>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
        >
          <p className="hero-tagline">
            On crée. On livre.<br />
            <strong>On recommence.</strong>
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">Voir les projets →</a>
            <a href="#contact" className="btn-ghost">Démarrer</a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <span>scroll</span>
        <div className="scroll-track">
          <div className="scroll-bar" />
        </div>
      </div>

    </section>
  );
}
