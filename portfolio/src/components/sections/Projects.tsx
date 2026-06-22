"use client";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";

const scenes = ["scene-1", "scene-2", "scene-3", "scene-4", "scene-5", "scene-6"] as const;
const ease = [0.16, 1, 0.3, 1] as const;

export default function Projects() {
  return (
    <section id="projects">
      <div className="section">
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
          >
            Réalisations
          </motion.h2>
          <a href="#contact" className="section-link">Nouveau projet ↗</a>
        </div>

        <div className="work-grid">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              className="work-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease }}
            >
              <div className={`work-scene ${scenes[i % scenes.length]}`}>
                <div className="work-scene-inner">
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                    <rect x="16" y="16" width="68" height="68" rx="6" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                    <rect x="28" y="28" width="44" height="44" rx="3" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
                    <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
                  </svg>
                </div>
              </div>

              <div className="work-info">
                <div className="work-category">{p.tags[0]}</div>
                <h3 className="work-name">{p.title}</h3>
                <div className="work-tags">
                  {p.tags.slice(0, 3).map((t) => (
                    <span className="work-tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
