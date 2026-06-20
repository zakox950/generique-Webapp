export default function Home() {
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
        gap: "1.25rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <span className="mono-label">console de reconnaissance</span>
      <h1
        className="wordmark"
        style={{ fontSize: "var(--text-2xl)" }}
      >
        Spyfie<span className="dot">.</span>
      </h1>
      <p
        className="mono"
        style={{ maxWidth: "42ch", lineHeight: 1.7 }}
      >
        // bootstrap ok — le deck de cibles arrive en phase 6
      </p>
    </main>
  );
}
