"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "◻" },
  { href: "/admin/commandes", label: "Commandes", icon: "📋" },
  { href: "/admin/devis", label: "Devis", icon: "📄" },
  { href: "/admin/catalogue", label: "Catalogue", icon: "🧁" },
  { href: "/admin/stock", label: "Stock", icon: "📦" },
  { href: "/admin/plus", label: "Plus", icon: "⋯" },
];

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside
      className="admin-bg-animated"
      style={{
        width: "240px",
        minHeight: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 24px 28px" }}>
        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "26px",
            fontWeight: 500,
            color: "#e8f5ec",
            lineHeight: 1.1,
          }}
        >
          Atelier
        </div>
        <div style={{ fontSize: "11px", color: "rgba(232,245,236,0.45)", fontFamily: "var(--font-manrope)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>
          Administration
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", padding: "0 12px" }}>
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || (pathname.startsWith(href) && href !== "/admin");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "12px",
                textDecoration: "none",
                background: active ? "rgba(94,201,154,0.18)" : "transparent",
                color: active ? "#5ec99a" : "rgba(232,245,236,0.55)",
                fontSize: "14px",
                fontFamily: "var(--font-manrope)",
                fontWeight: active ? 600 : 400,
                transition: "all 0.2s",
              }}
              className={active ? "nav-item-active" : ""}
            >
              <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 24px 0", borderTop: "1px solid rgba(232,245,236,0.08)" }}>
        <Link
          href="/admin/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "rgba(232,245,236,0.4)",
            fontSize: "12px",
            textDecoration: "none",
            fontFamily: "var(--font-manrope)",
          }}
        >
          <span>⏻</span> Déconnexion
        </Link>
      </div>
    </aside>
  );
}

function MobileBottomNav({ pathname }: { pathname: string }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "calc(100% - 32px)",
        maxWidth: "430px",
      }}
    >
      <div
        style={{
          background: "rgba(13,34,24,0.92)",
          backdropFilter: "blur(16px)",
          borderRadius: "999px",
          padding: "8px 4px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "0 8px 32px rgba(13,34,24,0.5)",
          border: "1px solid rgba(94,201,154,0.15)",
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || (pathname.startsWith(href) && href !== "/admin");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                color: active ? "#5ec99a" : "rgba(232,245,236,0.45)",
                textDecoration: "none",
                padding: "4px 8px",
                borderRadius: "999px",
                background: active ? "rgba(94,201,154,0.15)" : "transparent",
              }}
            >
              <span style={{ fontSize: "16px" }}>{icon}</span>
              <span style={{ fontSize: "9px", fontFamily: "var(--font-manrope)" }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin-theme" style={{ minHeight: "100vh", background: "#d4e5d6" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar pathname={pathname} />
      </div>

      {/* Main content */}
      <main
        style={{
          fontFamily: "var(--font-manrope)",
        }}
        className="lg:ml-[240px] pb-24 lg:pb-8 min-h-screen"
      >
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="lg:hidden">
        <MobileBottomNav pathname={pathname} />
      </div>
    </div>
  );
}
