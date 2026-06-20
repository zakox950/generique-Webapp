// Console admin — placeholder (étoffée en phase 7).
// L'accès est protégé par le middleware ; si on est ici, la session est valide.
export default function AdminConsole() {
  return (
    <main
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <span className="mono-label">session active</span>
      <h1 className="display" style={{ fontSize: "var(--text-xl)" }}>
        Console de reconnaissance
      </h1>
      <p className="mono" style={{ maxWidth: "42ch" }}>
        // gate ok — la gestion des cibles arrive en phase 7
      </p>
    </main>
  );
}
