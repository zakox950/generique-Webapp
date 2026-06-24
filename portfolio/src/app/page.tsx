import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import { getShowcaseSites } from "@/lib/showcase";
import { stack } from "@/lib/data";

// Re-read the showcase folder on every request so dropping a new
// site folder + restart picks it up without code changes.
export const dynamic = "force-dynamic";

const doubled = [...stack, ...stack];

export default function Home() {
  const sites = getShowcaseSites();

  return (
    <>
      <Navbar />

      {/* ─── Global plant photo accents — fixed, faded into the page ─── */}
      <div className="page-flora" aria-hidden="true">
        {/* eslint-disable @next/next/no-img-element */}
        <img className="flora-img flora-tl" src="/flora/foliage.webp" alt="" loading="lazy" />
        <img className="flora-img flora-br" src="/flora/foliage.webp" alt="" loading="lazy" />
        <img className="flora-img flora-mr" src="/flora/plant.webp" alt="" loading="lazy" />
        {/* eslint-enable @next/next/no-img-element */}
      </div>

      <main>
        <Hero />

        <Work sites={sites} />

        {/* ─── Marquee strip ─── */}
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track">
            {doubled.map((item, i) => (
              <div key={i} className="marquee-item">
                <span className="marquee-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <Services />
        <About />
        <Contact />
      </main>

      <footer className="footer">
        <span className="footer-logo">
          Spy<em>fie</em>
        </span>
        <span>© 2026 — Tous droits réservés</span>
        <span>Next.js · TypeScript</span>
      </footer>
    </>
  );
}
