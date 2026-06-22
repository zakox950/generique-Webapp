"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const counterRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    counterRefs.current.forEach((el) => {
      if (!el) return;
      const target = parseInt(el.dataset.target ?? "0", 10);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current).toString() + (el.dataset.suffix ?? "");
        if (current >= target) clearInterval(timer);
      }, 20);
    });
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-badge">
        <span className="dot" />
        Disponible pour de nouveaux projets
      </div>

      <h1 className="hero-title">
        <span className="line">On construit</span>
        <span className="line accent">l&apos;exceptionnel.</span>
        <span className="line outline">En ligne.</span>
      </h1>

      <p className="hero-sub">
        Studio de développement web spécialisé dans les applications Next.js performantes,
        les designs qui convertissent et les architectures qui tiennent dans le temps.
      </p>

      <div className="hero-actions">
        <a href="#projects" className="btn-primary">Voir nos projets</a>
        <a href="#contact" className="btn-outline">Nous contacter</a>
      </div>

      <div className="hero-stats">
        <div className="stat">
          <span
            className="stat-number"
            ref={(el) => { if (el) counterRefs.current[0] = el; }}
            data-target="32"
            data-suffix="+"
          >0+</span>
          <span className="stat-label">Projets livrés</span>
        </div>
        <div className="stat">
          <span
            className="stat-number"
            ref={(el) => { if (el) counterRefs.current[1] = el; }}
            data-target="98"
            data-suffix="%"
          >0%</span>
          <span className="stat-label">Clients satisfaits</span>
        </div>
        <div className="stat">
          <span
            className="stat-number"
            ref={(el) => { if (el) counterRefs.current[2] = el; }}
            data-target="4"
            data-suffix=" ans"
          >0 ans</span>
          <span className="stat-label">D&apos;expérience</span>
        </div>
      </div>

      <div className="hero-scroll">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
