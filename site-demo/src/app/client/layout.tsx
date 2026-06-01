"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <polygon points="12,2 2,7 12,12 22,7"/>
      <polyline points="2,17 12,22 22,17"/>
      <polyline points="2,12 12,17 22,12"/>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.09 6.09l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.8 16.92z"/>
    </svg>
  );
}

const navItems = [
  { href: "/client/accueil", label: "Accueil", icon: HomeIcon },
  { href: "/client/catalogue", label: "Shop", icon: LayersIcon },
  { href: "/client/panier", label: "Panier", icon: CartIcon },
  { href: "/client/contact", label: "Contact", icon: PhoneIcon },
];

function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        width: "calc(100% - 32px)",
        maxWidth: "400px",
      }}
    >
      <div
        style={{
          background: "rgba(56,22,27,0.42)",
          backdropFilter: "blur(22px) saturate(170%)",
          WebkitBackdropFilter: "blur(22px) saturate(170%)",
          borderRadius: "999px",
          padding: "10px 8px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "0 8px 32px rgba(56,22,27,0.3)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                color: active ? "#fff" : "rgba(245,240,232,0.45)",
                textDecoration: "none",
                padding: "4px 14px",
                borderRadius: "999px",
                background: active ? "rgba(145,31,35,0.45)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <Icon />
              <span style={{ fontSize: "10px", fontFamily: "var(--font-manrope)", letterSpacing: "0.04em" }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Outer — fond crème sombre visible sur desktop */
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(202,160,150,0.45), #d4b8b1 75%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      {/* Inner — phone frame */}
      <div
        className="client-theme"
        style={{
          width: "min(100vw, 430px)",
          minHeight: "100vh",
          background: "var(--c-bg-1)",
          position: "relative",
          boxShadow: "0 0 60px rgba(0,0,0,0.45)",
          overflowX: "hidden",
          fontFamily: "var(--font-manrope)",
        }}
      >
        <main style={{ paddingBottom: "88px" }}>{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
