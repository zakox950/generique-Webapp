import Link from "next/link";

export default function AlreadyExistsPage() {
  return (
    <div className="admin-root admin-auth-page">
      <img
        className="bg-photo"
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
        alt=""
        aria-hidden="true"
      />
      <div className="bg-overlay" />

      <div className="auth-card glass-base" style={{ textAlign: "center" }}>
        <div className="auth-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
            <path d="M8 12h8M12 8v8"/>
          </svg>
          <span className="auth-brand-name">Françoise</span>
        </div>

        <div style={{ marginTop: 24 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" style={{ opacity: 0.5, marginBottom: 12 }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <h1 className="auth-title">Compte existant</h1>
        <p className="auth-sub">Un compte administrateur est déjà configuré.</p>

        <Link href="/admin/login" className="btn-primary full-width" style={{ marginTop: 24, display: "block" }}>
          Se connecter
        </Link>
      </div>
    </div>
  );
}
