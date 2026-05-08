/**
 * Omkar Dhareshwar × ManWith3Balls — Portfolio v3.0
 *
 * App.jsx is now the orchestrator only. All sections live in
 * /src/components/. All data lives in /src/data/. All hooks
 * live in /src/hooks/. All shared primitives live in
 * /src/components/shared/. Global CSS lives in /src/styles/.
 *
 * To add a new section: build it in /src/components/<Section>/,
 *   import it here, and place it inside <main>.
 */

import { useState, useEffect } from "react";
import "./styles/globals.css";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
import { SECTIONS } from "./data/nav";

// ─────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────
import { useActiveSection } from "./hooks/useActiveSection";
import { useSEO } from "./hooks/useSEO";

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────
import { Cursor } from "./components/Cursor/Cursor";
import { Navbar } from "./components/Nav/Navbar";
import { ScrollProgress } from "./components/Nav/ScrollProgress";
import { SideRail } from "./components/Nav/SideRail";
import { BackToTop } from "./components/Nav/BackToTop";
import { Hero } from "./components/Hero/Hero";
import { CredStrip } from "./components/CredStrip/CredStrip";
import { Offerings } from "./components/Offerings/Offerings";
import { Work } from "./components/Work/Work";
import { Press } from "./components/Press/Press";
import { Testimonials } from "./components/Testimonials/Testimonials";
import { Timeline } from "./components/Timeline/Timeline";
import { FieldNotes } from "./components/FieldNotes/FieldNotes";
import { Adventures } from "./components/Adventures/Adventures";
import { Media } from "./components/Media/Media";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";
// MarqueeStrip kept in /components/MarqueeStrip/ but no longer rendered

// ─────────────────────────────────────────────────────────────
// PORTFOLIO — root orchestrator
// ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(SECTIONS.map((s) => s.id));
  useSEO();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Reveal-on-scroll observer (CSS class .reveal → .in)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.07, rootMargin: "0px 0px -32px 0px" }
    );
    const observe = () => document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const t = setTimeout(observe, 150);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Navbar scrolled={scrolled} activeSection={activeSection} />
      <SideRail activeSection={activeSection} sections={SECTIONS} />
      <main>
        <Hero />
        <CredStrip />
        <Offerings />
        <Work />
        <Press />
        <Testimonials />
        <Timeline />
        <FieldNotes />
        <Adventures />
        <Media />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
