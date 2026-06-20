import type { PublicTarget } from "@/lib/types";

/** Bande de télémétrie mono en haut de la carte active : donnée réelle. */
export default function TelemetryBar({ target }: { target: PublicTarget }) {
  return (
    <div className="telemetry-bar">
      <span className="dotsig" aria-hidden="true" />
      <span className="url">{target.url}</span>
      <span className="vp">
        <span className="desktop-only">1440×900</span>
        <span className="mobile-only">390×844</span>
      </span>
      <span className="status">CACHED</span>
    </div>
  );
}
