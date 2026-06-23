import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spyfie — Studio Digital",
  description: "Studio de développement web sur-mesure. Applications Next.js, design UI/UX, backend scalable.",
  openGraph: {
    title: "Spyfie — Studio Digital",
    description: "On construit. On livre. On recommence.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
