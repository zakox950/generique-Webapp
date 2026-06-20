/**
 * Rendu responsive RÉEL : deux sources distinctes (pas un reflow).
 * Le visiteur mobile reçoit la capture mobile, le desktop la capture desktop,
 * via <picture> + media query — choix piloté par le viewport du visiteur.
 */
type Kind = "preview" | "full";

export default function ShotPicture({
  id,
  title,
  kind = "preview",
  loading = "lazy",
}: {
  id: string;
  title: string;
  kind?: Kind;
  loading?: "lazy" | "eager";
}) {
  const desktop = `/api/shots/${id}/desktop-${kind}`;
  const mobile = `/api/shots/${id}/mobile-${kind}`;
  return (
    <picture className={kind === "preview" ? "shot" : undefined}>
      <source media="(max-width: 768px)" srcSet={mobile} />
      <img
        src={desktop}
        alt={`${title} — capture ${kind === "full" ? "page complète" : "aperçu"}`}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}
