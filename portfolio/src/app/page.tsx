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

      {/* ─── Global botanical background — fixed, animates via CSS ─── */}
      <div className="page-flora" aria-hidden="true">
        {/* Left mid — fern frond */}
        <svg className="flora-l1" viewBox="0 0 260 600" xmlns="http://www.w3.org/2000/svg">
          <g strokeWidth="1" fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M130 590 Q125 450 110 300 Q95 150 120 10" />
            <path d="M125 530 Q80 500 40 510 Q60 490 125 520" />
            <path d="M125 530 Q160 495 200 500 Q180 485 125 520" />
            <path d="M120 470 Q75 440 38 448 Q56 428 120 460" />
            <path d="M120 470 Q158 435 195 440 Q175 422 120 460" />
            <path d="M115 410 Q72 378 36 386 Q54 366 115 400" />
            <path d="M115 410 Q153 376 188 380 Q170 360 115 400" />
            <path d="M113 350 Q73 318 40 325 Q56 308 113 342" />
            <path d="M113 350 Q150 316 182 320 Q165 303 113 342" />
            <path d="M115 290 Q78 260 50 266 Q64 250 115 284" />
            <path d="M115 290 Q150 258 178 263 Q163 247 115 284" />
          </g>
        </svg>
        {/* Right mid — pine branch */}
        <svg className="flora-r1" viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg">
          <g strokeWidth="0.9" fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M40 460 Q150 340 240 220 Q310 130 360 30" />
            <path d="M120 410 Q180 380 240 360" />
            <path d="M165 360 Q235 325 300 305" />
            <path d="M215 305 Q285 268 345 248" />
            <path d="M120 410 Q75 375 35 365" />
            <path d="M165 360 Q110 322 65 312" />
            <path d="M215 305 Q158 266 116 258" />
          </g>
        </svg>
        {/* Bottom-left — leaf cluster */}
        <svg className="flora-l2" viewBox="0 0 280 420" xmlns="http://www.w3.org/2000/svg">
          <g strokeWidth="0.9" fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M140 420 Q138 300 135 180 Q132 90 140 0" />
            <path d="M136 360 Q90 320 62 308 Q100 295 136 348" />
            <path d="M136 360 Q178 318 202 305 Q168 292 136 348" />
            <path d="M135 290 Q92 252 66 240 Q100 228 135 278" />
            <path d="M135 290 Q174 250 198 237 Q166 225 135 278" />
            <path d="M135 222 Q96 186 74 175 Q105 164 135 212" />
            <path d="M135 222 Q170 184 190 172 Q162 161 135 212" />
          </g>
        </svg>
        {/* Bottom-right — tall narrow frond */}
        <svg className="flora-r2" viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg">
          <g strokeWidth="1" fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M100 330 Q98 220 95 120 Q92 50 100 5" />
            <path d="M97 280 Q55 250 28 258 Q65 238 97 268" />
            <path d="M97 280 Q138 248 162 255 Q130 235 97 268" />
            <path d="M96 220 Q55 192 30 198 Q64 180 96 210" />
            <path d="M96 220 Q135 190 158 196 Q128 178 96 210" />
            <path d="M96 162 Q59 135 38 141 Q68 124 96 152" />
            <path d="M96 162 Q130 134 150 139 Q124 122 96 152" />
            <path d="M97 108 Q68 84 52 88 Q74 74 97 100" />
            <path d="M97 108 Q122 83 136 87 Q117 73 97 100" />
          </g>
        </svg>
        {/* Subtle center solo leaf */}
        <svg className="flora-c" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
          <g strokeWidth="0.8" fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M50 195 Q48 130 46 70 Q44 30 50 2" />
            <path d="M48 160 Q22 138 8 143 Q30 128 48 152" />
            <path d="M48 160 Q72 137 84 142 Q64 127 48 152" />
            <path d="M47 118 Q24 98 12 102 Q32 88 47 112" />
            <path d="M47 118 Q68 97 78 101 Q61 87 47 112" />
          </g>
        </svg>
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
