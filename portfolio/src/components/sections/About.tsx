"use client";
import { useEffect, useRef } from "react";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="about-section">
      <div className="about-grid">
        <div className="about-visual">
          <div className="about-photo-placeholder">◎</div>
          <div className="about-badge about-badge-tl">
            <div className="badge-number">4+</div>
            <div className="badge-label">ans d&apos;expérience</div>
          </div>
          <div className="about-badge about-badge-br">
            <div className="badge-number">32</div>
            <div className="badge-label">projets livrés</div>
          </div>
        </div>

        <div className="about-text">
          <div className="section-label">À propos</div>
          <h2 className="section-title">On code ce qui<br /><span style={{ color: "var(--blue-400)" }}>fait la différence</span></h2>
          <p>
            Studio indépendant spécialisé dans le développement web sur-mesure.
            On travaille avec des <strong>startups, PME et agences</strong> qui veulent
            des produits digitaux qui performent vraiment.
          </p>
          <p>
            Notre approche : <strong>code propre, design soigné, délais tenus</strong>.
            On ne fait pas de l&apos;à-peu-près — chaque projet est traité comme si c&apos;était le nôtre.
          </p>
          <p>
            Stack principal : Next.js, TypeScript, PostgreSQL, Docker.
            On aime les défis techniques et les interfaces qui surprennent.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <a href="#contact" className="btn-primary">Travailler avec nous</a>
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .about-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
