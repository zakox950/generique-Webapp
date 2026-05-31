import { SessionProvider } from "next-auth/react";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="admin-root">
        <img
          className="bg-photo"
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt=""
          aria-hidden="true"
        />
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
