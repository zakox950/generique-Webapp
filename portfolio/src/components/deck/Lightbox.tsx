"use client";
import { useEffect } from "react";
import type { PublicTarget } from "@/lib/types";
import ShotPicture from "./ShotPicture";

/** Affiche la capture page-complète d'une cible. Fermeture par clic/Échap. */
export default function Lightbox({
  target,
  onClose,
}: {
  target: PublicTarget;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-head">
        <span className="dotsig" aria-hidden="true" style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "var(--signal)", boxShadow: "0 0 8px var(--signal)",
        }} />
        <span className="lb-url">{target.url}</span>
        <span>· page complète</span>
        <button
          className="lightbox-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          fermer ✕
        </button>
      </div>
      <div className="lightbox-scroll" onClick={(e) => e.stopPropagation()}>
        <ShotPicture id={target.id} title={target.title} kind="full" loading="eager" />
      </div>
    </div>
  );
}
