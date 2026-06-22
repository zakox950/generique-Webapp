"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-logo">
        dev<span>.</span>studio
      </div>
      <ul className="nav-links">
        <li><a href="#projects">Projets</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">À propos</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <a href="#contact" className="nav-cta">Démarrer un projet</a>
    </nav>
  );
}
