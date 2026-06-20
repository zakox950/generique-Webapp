"use client";
import type { PublicTarget } from "@/lib/types";
import ShotPicture from "./ShotPicture";

/** Registre des interceptions : grille de toutes les captures. */
export default function ExpandedGrid({
  targets,
  onOpen,
}: {
  targets: PublicTarget[];
  onOpen: (t: PublicTarget) => void;
}) {
  return (
    <div className="expanded-grid">
      {targets.map((t) => (
        <button key={t.id} className="grid-card" onClick={() => onOpen(t)}>
          <div className="gshot">
            <ShotPicture id={t.id} title={t.title} kind="preview" />
          </div>
          <div className="gmeta">
            <div className="gname">{t.title}</div>
            <div className="gurl">{t.url}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
