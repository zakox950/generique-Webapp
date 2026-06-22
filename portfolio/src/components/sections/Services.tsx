"use client";
import { useEffect, useRef } from "react";
import { services, stack } from "@/lib/data";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".service-card");
    if (!cards) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 100);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const doubled = [...stack, ...stack];

  return (
    <section id="services" ref={sectionRef}>
      <div className="section-label">Services</div>
      <h2 className="section-title">Ce qu&apos;on fait</h2>
      <p className="section-sub">
        De l&apos;idée au déploiement, on couvre l&apos;ensemble du cycle de vie de votre produit digital.
      </p>

      <div className="services-grid">
        {services.map((s) => (
          <div key={s.title} className="service-card reveal-card">
            <span className="service-icon">{s.icon}</span>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.description}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "4rem" }}>
        <div className="section-label" style={{ marginBottom: "1.5rem" }}>Stack technique</div>
        <div className="stack-track">
          <div className="stack-inner">
            {doubled.map((item, i) => (
              <div key={i} className="stack-item">
                <span style={{ color: "var(--blue-500)" }}>◆</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .service-card.reveal-card {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .service-card.reveal-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
