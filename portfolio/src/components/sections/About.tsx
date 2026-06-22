"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { stack } from "@/lib/data";

const ease = [0.16, 1, 0.3, 1] as const;

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* Left and right columns move at different rates for depth */
  const leftY  = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rightY = useTransform(scrollYProgress, [0, 1], [60, -20]);

  return (
    <section id="about" ref={ref}>
      <div className="section">
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
          >
            Studio
          </motion.h2>
        </div>

        <div className="about-grid">
          {/* Left: statement */}
          <motion.div style={{ y: leftY }}>
            <motion.p
              className="about-statement"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease }}
            >
              Code sharp.<br />
              Design <span className="serif-accent orange">bold</span>.<br />
              Ship fast.
            </motion.p>
          </motion.div>

          {/* Right: body */}
          <motion.div className="about-body" style={{ y: rightY }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              Studio indépendant spécialisé dans la création d&apos;applications web sur-mesure.
              On travaille avec des <strong>startups, PME et agences</strong> qui veulent
              des produits qui performent.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.18, ease }}
            >
              Code propre, délais tenus, design qui convertit.
              On ne fait pas de l&apos;à-peu-près.
            </motion.p>

            <motion.div
              className="about-tags"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.25, ease }}
            >
              {stack.map((t) => (
                <span className="about-tag" key={t}>{t}</span>
              ))}
            </motion.div>

            <motion.div
              style={{ marginTop: "2.5rem" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.32, ease }}
            >
              <a href="#contact" className="btn-primary">Travailler ensemble →</a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
