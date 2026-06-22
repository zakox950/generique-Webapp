"use client";
import { useEffect, useRef } from "react";
import { projects } from "@/lib/data";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".project-card");
    if (!cards) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.transitionDelay = `${i * 80}ms`;
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef}>
      <div className="section-label">Réalisations</div>
      <h2 className="section-title">Nos derniers projets</h2>
      <p className="section-sub">
        Chaque projet est une opportunité de repousser les limites du web.
        Voici une sélection de nos réalisations récentes.
      </p>

      <div className="projects-grid">
        {projects.map((p) => (
          <article
            key={p.id}
            className={`project-card reveal${p.featured ? " featured" : ""}`}
          >
            <div className="project-image">
              <div className="project-placeholder">◈</div>
              <div className="project-overlay">
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener" className="overlay-link"
                    onClick={(e) => e.stopPropagation()}>
                    Voir le site ↗
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener" className="overlay-link ghost"
                    onClick={(e) => e.stopPropagation()}>
                    GitHub
                  </a>
                )}
              </div>
            </div>
            <div className="project-body">
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.description}</p>
              <div className="project-tags">
                {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .project-card.reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .project-card.reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
