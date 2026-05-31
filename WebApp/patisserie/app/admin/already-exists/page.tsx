import Link from "next/link";

export default function AlreadyExistsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <h1>Un compte administrateur existe déjà.</h1>
      <Link href="/admin/login">← Se connecter</Link>
    </div>
  );
}
