import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <div className="grid-bg" aria-hidden="true" />
      <div className="orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Services />
        <About />
        <Contact />
      </main>

      <footer>
        <span>© 2026 dev.studio — Tous droits réservés</span>
        <span style={{ color: "var(--blue-500)" }}>Fait avec Next.js & ♥</span>
      </footer>
    </>
  );
}
