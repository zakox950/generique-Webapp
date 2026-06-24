"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const LINKS = [
  {
    id: "projects",
    label: "Projets",
    icon: (
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="4" height="4" rx="0.8"/>
        <rect x="7" y="1" width="4" height="4" rx="0.8"/>
        <rect x="1" y="7" width="4" height="4" rx="0.8"/>
        <rect x="7" y="7" width="4" height="4" rx="0.8"/>
      </svg>
    ),
  },
  {
    id: "services",
    label: "Services",
    icon: (
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 3.5l5-2.5 5 2.5-5 2.5z"/>
        <path d="M1 6.5l5 2.5 5-2.5"/>
        <path d="M1 9.5l5 2.5 5-2.5" opacity="0.45"/>
      </svg>
    ),
  },
  {
    id: "about",
    label: "Studio",
    icon: (
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="3.8" r="2.2"/>
        <path d="M1 11c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5"/>
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    icon: (
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="2.5" width="10" height="7.5" rx="1.2"/>
        <path d="M1 4.5l5 3 5-3"/>
      </svg>
    ),
  },
];

const SECTIONS = ["home", "projects", "services", "about", "contact"];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const mid = window.innerHeight * 0.38;

      // Active section tracking
      let current = "home";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) current = id;
      }
      setActive(current);

      // Auto-hide on mobile: hide when scrolling down past 80px, show on scroll up
      if (window.innerWidth <= 760) {
        setHidden(y > lastY.current && y > 80);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${hidden ? " nav--hidden" : ""}`}>
      <a href="#home" className="nav-logo">
        Spy<em>fie</em>
      </a>

      <div className="nav-island">
        {LINKS.map(({ id, label, icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-island-link${isActive ? " active" : ""}`}
            >
              {isActive && (
                <motion.span
                  className="nav-island-pill"
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="nav-island-icon">{icon}</span>
              <span className="nav-island-label">{label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
