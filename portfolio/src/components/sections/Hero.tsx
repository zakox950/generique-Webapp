"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Botanical SVG: fern frond ── */
function FernLeft() {
  return (
    <svg className="botanical-svg botanical-left" viewBox="0 0 260 600" xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth="1" fill="none" stroke="currentColor" strokeLinecap="round">
        {/* Central stem */}
        <path d="M130 590 Q125 450 110 300 Q95 150 120 10" />
        {/* Frond pairs — large bottom, small top */}
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
        <path d="M117 232 Q82 205 58 210 Q70 195 117 226" />
        <path d="M117 232 Q150 203 174 207 Q162 192 117 226" />
        <path d="M119 178 Q88 152 68 157 Q79 143 119 172" />
        <path d="M119 178 Q148 152 168 155 Q158 141 119 172" />
        <path d="M121 128 Q96 105 80 109 Q88 96 121 123" />
        <path d="M121 128 Q144 104 162 108 Q152 94 121 123" />
        <path d="M122 82 Q103 60 92 64 Q97 53 122 78" />
        <path d="M122 82 Q140 60 150 63 Q145 52 122 78" />
      </g>
    </svg>
  );
}

/* ── Botanical SVG: pine branch ── */
function PineBranch() {
  return (
    <svg className="botanical-svg botanical-right" viewBox="0 0 480 520" xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth="0.8" fill="none" stroke="currentColor" strokeLinecap="round">
        {/* Main branch */}
        <path d="M60 480 Q180 360 280 240 Q360 140 420 40" />
        {/* Sub-branches right */}
        <path d="M140 430 Q200 400 260 380" />
        <path d="M185 380 Q255 345 320 325" />
        <path d="M235 325 Q305 288 365 268" />
        <path d="M280 270 Q345 235 398 218" />
        <path d="M325 218 Q382 185 425 172" />
        <path d="M365 168 Q410 140 440 130" />
        {/* Sub-branches left */}
        <path d="M140 430 Q95 395 55 385" />
        <path d="M185 380 Q130 342 85 332" />
        <path d="M235 325 Q178 286 136 278" />
        <path d="M280 270 Q228 234 192 226" />
        <path d="M325 218 Q278 185 248 178" />
        {/* Pine needle clusters — right */}
        <path d="M260 380 Q285 365 300 352 Q275 362 260 380" />
        <path d="M260 380 Q290 390 308 382 Q282 375 260 380" />
        <path d="M320 325 Q348 310 362 298 Q336 308 320 325" />
        <path d="M320 325 Q352 335 368 328 Q342 320 320 325" />
        <path d="M365 268 Q392 254 405 242 Q380 252 365 268" />
        <path d="M365 268 Q396 278 410 271 Q384 264 365 268" />
        {/* Pine needle clusters — left */}
        <path d="M55 385 Q30 368 18 355 Q44 365 55 385" />
        <path d="M55 385 Q26 395 14 388 Q40 380 55 385" />
        <path d="M85 332 Q58 315 44 302 Q72 312 85 332" />
        <path d="M85 332 Q55 342 40 335 Q68 327 85 332" />
      </g>
    </svg>
  );
}

/* ── Botanical SVG: leaf cluster ── */
function LeafCluster() {
  return (
    <svg className="botanical-svg botanical-center" viewBox="0 0 280 420" xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth="0.9" fill="none" stroke="currentColor" strokeLinecap="round">
        {/* Central stem */}
        <path d="M140 420 Q138 300 135 180 Q132 90 140 0" />
        {/* Leaf pairs */}
        <path d="M136 360 Q90 320 62 308 Q100 295 136 348" />
        <path d="M136 360 Q178 318 202 305 Q168 292 136 348" />
        <path d="M135 290 Q92 252 66 240 Q100 228 135 278" />
        <path d="M135 290 Q174 250 198 237 Q166 225 135 278" />
        <path d="M135 222 Q96 186 74 175 Q105 164 135 212" />
        <path d="M135 222 Q170 184 190 172 Q162 161 135 212" />
        <path d="M136 158 Q102 125 84 115 Q110 106 136 148" />
        <path d="M136 158 Q168 123 184 112 Q160 103 136 148" />
        <path d="M137 98 Q110 68 96 60 Q118 52 137 90" />
        <path d="M137 98 Q162 66 174 58 Q155 50 137 90" />
        {/* Leaf veins */}
        <path d="M99 324 Q90 320 62 308" strokeWidth="0.4" />
        <path d="M168 321 Q178 318 202 305" strokeWidth="0.4" />
        <path d="M100 265 Q92 252 66 240" strokeWidth="0.4" />
        <path d="M166 263 Q174 250 198 237" strokeWidth="0.4" />
      </g>
    </svg>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  /* Three-layer parallax — back layers lag, foreground leads */
  const botanicalY  = useTransform(scrollY, [0, 1000], [0, 200]);   /* slowest */
  const decoY       = useTransform(scrollY, [0, 1000], [0, 140]);   /* medium */
  const contentY    = useTransform(scrollY, [0, 1000], [0, 70]);    /* fastest */
  const contentOpacity = useTransform(scrollY, [240, 680], [1, 0]);

  return (
    <section className="hero" id="home" ref={heroRef}>

      {/* ── Layer 1 — botanical illustrations (slowest, lives in bg) ── */}
      <motion.div
        style={{ y: botanicalY }}
        className="hero-layer"
        aria-hidden="true"
      >
        <FernLeft />
        <PineBranch />
        <LeafCluster />
      </motion.div>

      {/* ── Layer 2 — decorative wordmark (medium speed) ── */}
      <motion.div
        style={{ position: "absolute", inset: 0, y: decoY, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <motion.div
          className="hero-deco"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          Spyfie
        </motion.div>
      </motion.div>

      {/* ── Layer 3 — foreground content (fastest) ── */}
      <motion.div style={{ y: contentY, opacity: contentOpacity, position: "relative", zIndex: 2 }}>

        <motion.p
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="dot-pulse" />
          Studio digital — disponible
        </motion.p>

        <h1 className="hero-headline">
          <motion.span
            style={{ display: "block" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.08, ease }}
          >
            Craft
          </motion.span>
          <motion.span
            style={{ display: "block" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.16, ease }}
            className="tan"
          >
            &amp;
          </motion.span>
          <motion.span
            style={{ display: "block" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.24, ease }}
            className="stroke"
          >
            Code
          </motion.span>
        </h1>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
        >
          <p className="hero-tagline">
            On construit des produits web qui tiennent.<br />
            Précision artisanale, livraisons sans détour.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">Voir les projets →</a>
            <a href="#contact" className="btn-ghost">Démarrer</a>
          </div>
        </motion.div>
      </motion.div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span>scroll</span>
        <div className="scroll-track">
          <div className="scroll-bar" />
        </div>
      </div>

    </section>
  );
}
