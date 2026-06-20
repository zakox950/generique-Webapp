"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicTarget } from "@/lib/types";
import { useReducedMotion } from "@/lib/useReducedMotion";
import ShotPicture from "./ShotPicture";
import TelemetryBar from "./TelemetryBar";

const VISIBLE_BEHIND = 3;
const WHEEL_COOLDOWN = 480;

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ");
}

export default function DeckStack({
  targets,
  onOpen,
}: {
  targets: PublicTarget[];
  onOpen: (t: PublicTarget) => void;
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const lastWheel = useRef(0);
  const touchY = useRef<number | null>(null);

  const clamp = useCallback(
    (n: number) => Math.max(0, Math.min(targets.length - 1, n)),
    [targets.length],
  );
  const go = useCallback((dir: number) => setIndex((i) => clamp(i + dir)), [clamp]);

  // Molette : avance/recule, throttlée. Pas de wheel-jacking aux extrémités
  // (le scroll natif reprend la main) ni sous prefers-reduced-motion.
  useEffect(() => {
    if (reduced) return;
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const atStart = index === 0;
      const atEnd = index === targets.length - 1;
      const dir = e.deltaY > 0 ? 1 : -1;
      if ((dir > 0 && atEnd) || (dir < 0 && atStart)) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current < WHEEL_COOLDOWN) return;
      lastWheel.current = now;
      go(dir);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [index, reduced, go, targets.length]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onOpen(targets[index]);
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchY.current == null) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (dy < -40) go(1);
    else if (dy > 40) go(-1);
    touchY.current = null;
  }

  const active = targets[index];

  return (
    <>
      <div
        className="deck-stage"
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label="Pile de cibles interceptées"
        aria-activedescendant={`card-${active.id}`}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="deck-viewport">
          {targets.map((t, i) => {
            const pos = i - index;
            const isActive = pos === 0;
            const visible = pos >= 0 && pos <= VISIBLE_BEHIND;
            const style: React.CSSProperties =
              pos < 0
                ? {
                    transform: "translateY(-44px) scale(0.96)",
                    opacity: 0,
                    pointerEvents: "none",
                    zIndex: 0,
                  }
                : visible
                  ? {
                      transform: `translateY(${pos * 14}px) scale(${1 - pos * 0.04})`,
                      opacity: 1 - pos * 0.22,
                      zIndex: 50 - pos,
                    }
                  : {
                      transform: `translateY(${VISIBLE_BEHIND * 14}px) scale(${1 - VISIBLE_BEHIND * 0.04})`,
                      opacity: 0,
                      pointerEvents: "none",
                      zIndex: 0,
                    };
            return (
              <article
                key={t.id}
                id={`card-${t.id}`}
                className={`deck-card${isActive ? " is-active" : ""}`}
                style={style}
                role="option"
                aria-selected={isActive}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => (isActive ? onOpen(t) : setIndex(i))}
              >
                {isActive && <TelemetryBar target={t} />}
                <ShotPicture
                  id={t.id}
                  title={t.title}
                  kind="preview"
                  loading={pos <= 1 ? "eager" : "lazy"}
                />
                {isActive && !reduced && <div className="scanline" />}
              </article>
            );
          })}
        </div>

        <div className="deck-dots" role="presentation">
          {targets.map((t, i) => (
            <button
              key={t.id}
              className={`deck-dot${i === index ? " on" : ""}`}
              aria-label={`Cible ${i + 1} : ${t.title}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      <div className="deck-footer">
        <div>
          <div className="target-name">{active.title}</div>
          <div className="target-meta">
            {active.url} · captured_at {fmtDate(active.capturedAt)}
          </div>
          {active.tags.length > 0 && (
            <div className="tags">
              {active.tags.map((tg) => (
                <span className="tag" key={tg}>
                  {tg}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="hint">
          {index + 1} / {targets.length}
          <br />
          {reduced ? "↑ ↓ naviguer" : "défiler · ↑ ↓ · clic = page complète"}
        </div>
      </div>
    </>
  );
}
