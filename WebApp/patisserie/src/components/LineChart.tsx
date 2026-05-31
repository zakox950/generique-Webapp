"use client";
import { useRef, useState, useEffect, useCallback } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  unit?: string;
  color?: string;
  height?: number;
}

function fmt(v: number, unit: string) {
  if (unit === "€") return v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  return `${v}${unit}`;
}

export default function LineChart({ data, unit = "", color = "#697C70", height = 160 }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; value: number; label: string } | null>(null);
  const [dims, setDims] = useState({ w: 0, h: height });

  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height: h } = entries[0].contentRect;
      setDims({ w: width, h: h || height });
    });
    ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, [height]);

  const pad = { top: 16, right: 16, bottom: 28, left: 8 };
  const w = dims.w;
  const h = dims.h;
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const values = data.map((d) => d.value);
  const min = Math.min(...values) * 0.9;
  const max = Math.max(...values) * 1.05 || 1;

  const toX = (i: number) => pad.left + (i / (data.length - 1 || 1)) * innerW;
  const toY = (v: number) => pad.top + innerH - ((v - min) / (max - min)) * innerH;

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.value), ...d }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${points[points.length - 1].x.toFixed(1)},${(pad.top + innerH).toFixed(1)} L${points[0].x.toFixed(1)},${(pad.top + innerH).toFixed(1)} Z`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = svgRef.current!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      let closest = points[0];
      let minDist = Infinity;
      for (const p of points) {
        const d = Math.abs(p.x - mx);
        if (d < minDist) { minDist = d; closest = p; }
      }
      setTip({ x: closest.x, y: closest.y, value: closest.value, label: closest.label });
    },
    [points],
  );

  const gradId = `grad-${color.replace("#", "")}`;

  if (!w) {
    return <svg ref={svgRef} style={{ width: "100%", height }} />;
  }

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        style={{ width: "100%", height, display: "block" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTip(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradId})`} />
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* X labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={h - 6}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(152,170,157,0.7)"
            fontFamily="var(--font-geist, system-ui)"
          >
            {p.label}
          </text>
        ))}

        {/* Tooltip dot */}
        {tip && (
          <circle cx={tip.x} cy={tip.y} r="4" fill={color} stroke="white" strokeWidth="2" />
        )}
      </svg>

      {/* Tooltip bubble */}
      {tip && (
        <div
          style={{
            position: "absolute",
            top: tip.y - 36,
            left: Math.min(Math.max(tip.x - 36, 0), w - 80),
            background: "rgba(30,35,36,0.92)",
            border: "1px solid rgba(152,170,157,0.2)",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 12,
            color: "#E8EDE9",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ opacity: 0.6 }}>{tip.label} · </span>
          <strong>{fmt(tip.value, unit)}</strong>
        </div>
      )}
    </div>
  );
}
