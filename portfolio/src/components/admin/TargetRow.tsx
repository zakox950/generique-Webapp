"use client";
import { useState } from "react";
import type { AdminTarget } from "@/lib/types";
import StatusBadge from "./StatusBadge";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ");
}

export default function TargetRow({
  target,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRecapture,
  onDelete,
}: {
  target: AdminTarget;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRecapture: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isActive =
    target.status === "CAPTURING" || target.status === "PENDING";

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setConfirmDelete(false);
    onDelete();
  }

  return (
    <div className={`target-row${isActive ? " is-live" : ""}`}>
      <div className="row-order" aria-label="Réordonner">
        <button
          className="btn-icon"
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label="Monter"
        >
          ↑
        </button>
        <span className="row-num">{index + 1}</span>
        <button
          className="btn-icon"
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label="Descendre"
        >
          ↓
        </button>
      </div>

      <div className="row-info">
        <span className="row-title">{target.title}</span>
        <span className="row-url">{target.url}</span>
        {target.capturedAt && (
          <span className="row-meta">
            captured_at {fmtDate(target.capturedAt)}
          </span>
        )}
        {target.status === "FAILED" && (
          <span className="row-meta row-meta-fail">
            CAPTURE FAILED — cible injoignable, réessayer
          </span>
        )}
        {target.tags.length > 0 && (
          <div className="row-tags">
            {target.tags.map((tg) => (
              <span className="tag" key={tg}>
                {tg}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="row-actions">
        <StatusBadge status={target.status} />
        <button
          className="btn-console btn-sm"
          onClick={onRecapture}
          disabled={isActive}
          aria-label="Relancer la capture"
        >
          recapturer
        </button>
        <button
          className={`btn-console btn-sm${confirmDelete ? " btn-danger-confirm" : " btn-danger"}`}
          onClick={handleDelete}
          disabled={isActive}
          aria-label={confirmDelete ? "Confirmer la suppression" : "Supprimer"}
          onBlur={() => setConfirmDelete(false)}
        >
          {confirmDelete ? "confirmer ?" : "supprimer"}
        </button>
      </div>
    </div>
  );
}
