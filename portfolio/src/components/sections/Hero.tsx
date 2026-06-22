"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  /* Multi-layer parallax — deeper layers lag more on scroll */
  const glowY    = useTransform(scrollY, [0, 1000], [0, 360]);
  const decoY    = useTransform(scrollY, [0, 1000], [0, 210]);
  const contentY = useTransform(scrollY, [0, 1000], [0, 80]);
  const contentOpacity = useTransform(scrollY, [280, 720], [1, 0]);

  return (
    <section className="hero" id="home" ref={heroRef}>

      {/* ─── Layer 1 — background glows (slowest) ─── */}
      <motion.div
        style={{ position: "absolute", inset: 0, pointerEvents: "none", y: glowY }}
        aria-hidden="true"
      >
        <div className="hero-glow" />
        <div className="hero-glow hero-glow-2" />
      </motion.div>

      {/* ─── Layer 2 — decorative wordmark (mid, gently floating) ─── */}
      <motion.div
        style={{ position: "absolute", inset: 0, pointerEvents: "none", y: decoY }}
        aria-hidden="true"
      >
        <motion.div
          className="hero-deco"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          Spyfie.
        </motion.div>
      </motion.div>

      {/* ─── Layer 3 — foreground content (fastest) ─── */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <motion.p
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="dot-pulse" /> Studio digital — disponible
        </motion.p>

        <h1 className="hero-headline">
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, y: 60, rotateX: 40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
          >
            Spyfie<span className="orange">.</span>
          </motion.span>
        </h1>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          <p className="hero-tagline">
            On crée. On livre.<br />
            On <span className="serif-accent orange">recommence</span>.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary magnetic">Voir les projets →</a>
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
