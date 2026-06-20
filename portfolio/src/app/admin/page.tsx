"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminTarget } from "@/lib/types";
import AddTargetForm from "@/components/admin/AddTargetForm";
import TargetRow from "@/components/admin/TargetRow";

const POLL_INTERVAL = 2000;

export default function AdminConsole() {
  const [targets, setTargets] = useState<AdminTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const pollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTargets = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/targets");
      if (!res.ok) return;
      const data: AdminTarget[] = await res.json();
      setTargets(Array.isArray(data) ? data : []);
    } catch {
      // network error — keep previous state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  // Poll every 2 s while a capture is in-flight.
  useEffect(() => {
    const hasActive = targets.some(
      (t) => t.status === "PENDING" || t.status === "CAPTURING",
    );
    if (hasActive && !pollerRef.current) {
      pollerRef.current = setInterval(fetchTargets, POLL_INTERVAL);
    } else if (!hasActive && pollerRef.current) {
      clearInterval(pollerRef.current);
      pollerRef.current = null;
    }
    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };
  }, [targets, fetchTargets]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function reorder(ids: string[]) {
    setTargets((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      return ids.map((id, i) => ({ ...map.get(id)!, order: i }));
    });
    await fetch("/api/admin/targets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const ids = targets.map((t) => t.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    reorder(ids);
  }

  function moveDown(index: number) {
    if (index === targets.length - 1) return;
    const ids = targets.map((t) => t.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    reorder(ids);
  }

  async function recapture(id: string) {
    await fetch(`/api/admin/targets/${id}/recapture`, { method: "POST" });
    fetchTargets();
    if (!pollerRef.current) {
      pollerRef.current = setInterval(fetchTargets, POLL_INTERVAL);
    }
  }

  async function deleteTarget(id: string) {
    await fetch(`/api/admin/targets/${id}`, { method: "DELETE" });
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }

  const activeCount = targets.filter(
    (t) => t.status === "PENDING" || t.status === "CAPTURING",
  ).length;

  return (
    <div className="admin-console">
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="wordmark" style={{ fontSize: "var(--text-lg)" }}>
            Spyfie<span className="dot">.</span>
          </span>
          <span className="admin-sub">
            {loading
              ? "chargement…"
              : activeCount > 0
                ? `${activeCount} capture${activeCount > 1 ? "s" : ""} en cours`
                : `${targets.length} cible${targets.length !== 1 ? "s" : ""}`}
          </span>
        </div>
        <button
          className="btn-console"
          onClick={logout}
          aria-label="Déconnexion"
        >
          déconnexion
        </button>
      </header>

      <div className="admin-body">
        <section className="admin-section">
          <span className="mono-label">// ajouter une cible</span>
          <AddTargetForm onAdded={fetchTargets} />
        </section>

        <section className="admin-section">
          <span className="mono-label">
            // registre des cibles interceptées
          </span>

          {loading ? (
            <div className="deck-empty">
              <span className="mono-label">scan en cours…</span>
            </div>
          ) : targets.length === 0 ? (
            <div className="deck-empty">
              <span className="mono-label">aucune cible enregistrée</span>
              <p
                className="mono"
                style={{ maxWidth: "40ch", textAlign: "center" }}
              >
                // le registre est vide — ajouter une URL pour lancer la
                première capture
              </p>
            </div>
          ) : (
            <div className="target-list">
              {targets.map((t, i) => (
                <TargetRow
                  key={t.id}
                  target={t}
                  index={i}
                  total={targets.length}
                  onMoveUp={() => moveUp(i)}
                  onMoveDown={() => moveDown(i)}
                  onRecapture={() => recapture(t.id)}
                  onDelete={() => deleteTarget(t.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
