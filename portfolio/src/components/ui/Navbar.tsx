"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="#home" className="nav-logo">
        Spy<em>fie</em>
      </a>
      <ul className="nav-links">
        <li><a href="#projects">Projets</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">Studio</a></li>
        <li><a href="#contact" className="nav-cta">Contact</a></li>
      </ul>
    </nav>
  );
}
