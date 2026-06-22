"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ShowcaseSite } from "@/lib/showcase";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Lightbox({
  site,
  onClose,
}: {
  site: ShowcaseSite;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={site.title}
      >
        <motion.div
          className="lightbox-bar"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lightbox-dots" aria-hidden="true">
            <span className="lightbox-dot" style={{ background: "#ff5f57" }} />
            <span className="lightbox-dot" style={{ background: "#febc2e" }} />
            <span className="lightbox-dot" style={{ background: "#28c840" }} />
          </div>

          <div className="lightbox-url">
            <span style={{ color: site.accent }}>●</span>
            spyfie.studio/{site.slug}
          </div>

          <div className="lightbox-actions">
            <a
              className="lightbox-btn"
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Nouvel onglet ↗
            </a>
            <button className="lightbox-btn primary" onClick={onClose}>
              Fermer ✕
            </button>
          </div>
        </motion.div>

        <motion.div
          className="lightbox-stage"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05, ease }}
          onClick={(e) => e.stopPropagation()}
        >
          <iframe src={site.url} title={site.title} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
