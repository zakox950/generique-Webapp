"use client";
import { motion } from "framer-motion";
import { services } from "@/lib/data";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Services() {
  return (
    <section id="services">
      <div className="section">
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease }}
          >
            Services
          </motion.h2>
        </div>

        <div className="services-list">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className="service-row"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: i * 0.07, ease }}
            >
              <span className="service-name">{s.title}</span>
              <p className="service-desc">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
