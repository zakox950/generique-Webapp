"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M3 12L12 3l9 9"/><path d="M5 10v10h5v-6h4v6h5V10"/>
    </svg>
  );
}
function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function IconCart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 014 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

interface ToastState {
  message: string;
  visible: boolean;
}

let toastQueue: ((msg: string) => void)[] = [];

export function showToast(message: string) {
  toastQueue.forEach((fn) => fn(message));
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (msg: string) => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({ message: msg, visible: true });
      toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
    };
    toastQueue.push(handler);
    return () => { toastQueue = toastQueue.filter((fn) => fn !== handler); };
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil", icon: <IconHome /> },
    { href: "/catalogue", label: "Catalogue", icon: <IconGrid /> },
    { href: "/panier", label: "Panier", icon: <IconCart /> },
    { href: "/commande", label: "Contact", icon: <IconPhone /> },
  ];

  return (
    <div className="shell">
      {/* Blobs décoratifs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Header */}
      <header className="app-header">
        <Link href="/" className="brand">Françoise</Link>
        <Link href="/panier" className="cart-btn" aria-label="Panier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </header>

      {/* Contenu principal */}
      <main className="page-content">
        {children}
      </main>

      {/* Navigation bas liquide */}
      <nav className="bottom-nav">
        {navLinks.map((link) => {
          const isCart = link.href === "/panier";
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-item${active ? " active" : ""}${isCart ? " cart-nav" : ""}`}
            >
              {link.icon}
              <span className="nav-label">{link.label}</span>
              {isCart && count > 0 && <span className="nav-badge">{count}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toast */}
      <div className={`toast${toast.visible ? " visible" : ""}`}>
        {toast.message}
      </div>
    </div>
  );
}
