"use client";
import { useEffect, useState } from "react";
import type { PublicTarget } from "@/lib/types";
import DeckStack from "@/components/deck/DeckStack";
import ExpandedGrid from "@/components/deck/ExpandedGrid";
import Lightbox from "@/components/deck/Lightbox";

export default function Home() {
  const [targets, setTargets] = useState<PublicTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<PublicTarget | null>(null);

  useEffect(() => {
    fetch("/api/targets")
      .then((r) => r.json())
      .then((data: PublicTarget[]) => setTargets(Array.isArray(data) ? data : []))
      .catch(() => setTargets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="deck-page">
      <header className="deck-header">
        <div className="left">
          <span className="wordmark" style={{ fontSize: "var(--text-lg)" }}>
            Spyfie<span className="dot">.</span>
          </span>
          <span className="count">
            {loading
              ? "scan…"
              : `${targets.length} cible${targets.length > 1 ? "s" : ""} interceptée${targets.length > 1 ? "s" : ""}`}
          </span>
        </div>
        {targets.length > 0 && (
          <button
            className="btn-console"
            onClick={() => setExpanded((v) => !v)}
            aria-pressed={expanded}
          >
            {expanded ? "replier" : "tout déplier"}
          </button>
        )}
      </header>

      {loading ? (
        <div className="deck-empty">
          <span className="mono-label">scan en cours…</span>
        </div>
      ) : targets.length === 0 ? (
        <div className="deck-empty">
          <span className="mono-label">aucune cible interceptée</span>
          <p className="mono" style={{ maxWidth: "40ch", textAlign: "center" }}>
            // le registre est vide — les cibles apparaissent ici une fois capturées
          </p>
        </div>
      ) : expanded ? (
        <ExpandedGrid targets={targets} onOpen={(t) => setLightbox(t)} />
      ) : (
        <DeckStack targets={targets} onOpen={(t) => setLightbox(t)} />
      )}

      {lightbox && (
        <Lightbox target={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
