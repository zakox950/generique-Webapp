import { SessionProvider } from "next-auth/react";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="admin-root">
        <div className="bg-animated" aria-hidden="true" />
        <div className="admin-blob blob-a" aria-hidden="true" />
        <div className="admin-blob blob-b" aria-hidden="true" />
        <div className="admin-blob blob-c" aria-hidden="true" />
        <div className="bg-overlay" />
        <div className="app-layout">
          <AdminNav />
          <div className="main">
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
