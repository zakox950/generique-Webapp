import type { CaptureStatus } from "@/lib/types";

export default function StatusBadge({ status }: { status: CaptureStatus }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {status === "PENDING" && "// PENDING"}
      {status === "CAPTURING" && "▶ CAPTURING"}
      {status === "CACHED" && "● CACHED"}
      {status === "FAILED" && "✕ FAILED"}
    </span>
  );
}
