/**
 * Omkar Dhareshwar × ManWith3Balls — Portfolio v2
 *
 * Design system:
 *  OD voice  → Cormorant Garamond, serif, structured, credible
 *  MW3B voice → DM Mono, raw, opinionated, slightly chaotic
 *
 * Standout interactions:
 *  1. Custom magnetic gold cursor (lerps, inflates on hover)
 *  2. 3D perspective tilt on work cards (per-card mouse tracking)
 *  3. Text scramble / glitch on the ManWith3Balls alias (hover)
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS & GLOBAL CSS
// ─────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

:root {
  /* ── Backgrounds ── */
  --bg: #F8F6F1;              /* warm cream — never pure white */
  --bg-warm: #F2EFE8;         /* slightly darker warm cream, used in form fields */

  /* ── Surfaces (cards, panels) ── */
  --surface: #FFFFFF;
  --surface-2: #F5F3EE;
  --surface-3: #EAE7DF;       /* deepest surface, used in work card thumbnails */

  /* ── Green accent system ── */
  --gold: #2E6B4F;            /* deep forest green — primary accent */
  --gold-light: #4A9068;      /* lighter green, used for highlighted names */
  --gold-bright: #358A5F;     /* hover state for buttons */
  --gold-dim: #1F4D38;        /* darker green, used in scrollbar + dimmer accents */
  --gold-faint: rgba(46,107,79,0.07); /* ghost background on hover */

  /* ── Ember / MW3B accent ── */
  --ember: #C4621D;            /* terracotta — used for MW3B voice moments */

  /* ── Text hierarchy ── */
  --text: #0F0F0D;             /* near-black, primary headings + body */
  --text-2: #2C2C29;           /* slightly softened, longer body copy */
  --text-3: #6B6860;           /* labels, captions, meta info */
  --text-4: #A09D96;           /* very muted: placeholders, dates */
  --text-dim: #2C2C29;         /* alias for --text-2, backward compat */
  --text-muted: #6B6860;       /* alias for --text-3, backward compat */

  /* ── Lines / borders ── */
  --line: rgba(15,15,13,0.14);
  --line-faint: rgba(15,15,13,0.07);
  --line-strong: rgba(15,15,13,0.22);
  --border: rgba(46,107,79,0.2);

  /* ── Legacy ── */
  --orange: #C4621D;           /* alias for --ember */
}  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    cursor: none; /* hide default — we have a custom cursor */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Restore cursor on mobile */
  @media (hover: none) { body { cursor: auto; } }

  a, button { cursor: none; }
  @media (hover: none) { a, button { cursor: pointer; } }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dim); }

  /* ── Noise grain overlay ── */
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 9999;
    pointer-events: none;
    opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 180px 180px;
  }

 /* ── Three Balls Cursor — ManWith3Balls ── */
  /* Hidden on touch devices */
  #cursor-wrap { pointer-events: none; }
  @media (hover: none) {
    body { cursor: auto !important; }
    #cursor-wrap { display: none; }
  }

  /* Each ball is a fixed circle that moves independently */
  .cursor-ball {
    position: fixed; top: 0; left: 0; z-index: 10000;
    border-radius: 50%; pointer-events: none;
    transform: translate(-50%, -50%);
    will-change: left, top;
  }

  /* Ball 1 — largest, closest to cursor, primary green */
  #ball-1 {
    width: 11px; height: 11px;
    background: var(--gold);
    transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
  }

  /* Ball 2 — medium, slightly behind, softer green */
  #ball-2 {
    width: 7px; height: 7px;
    background: var(--gold); opacity: 0.55;
    transition: width 0.2s ease, height 0.2s ease;
  }

  /* Ball 3 — smallest, trails furthest, terracotta (MW3B ember) */
  #ball-3 {
    width: 5px; height: 5px;
    background: var(--ember); opacity: 0.5;
    transition: width 0.2s ease, height 0.2s ease;
  }

  /* Hover state — balls expand into a larger presence */
  .cursor-hovered #ball-1 {
    width: 36px; height: 36px;
    background: var(--gold-faint);
    border: 1px solid var(--gold);
  }
  .cursor-hovered #ball-2 { width: 11px; height: 11px; opacity: 0.7; }
  .cursor-hovered #ball-3 { width: 8px; height: 8px; opacity: 0.6; }

  /* ── Scroll reveal ── */
  .reveal {
    opacity: 0; transform: translateY(32px);
    transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                transform 0.9s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.in { opacity: 1; transform: none; }
  .reveal-d1 { transition-delay: 0.08s; }
  .reveal-d2 { transition-delay: 0.18s; }
  .reveal-d3 { transition-delay: 0.28s; }
  .reveal-d4 { transition-delay: 0.40s; }

  /* ── Hero entrance ── */
  @keyframes rise {
    from { opacity:0; transform: translateY(42px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .h-1 { animation: rise 1.3s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
  .h-2 { animation: rise 1.4s cubic-bezier(0.16,1,0.3,1) 0.42s both; }
  .h-3 { animation: rise 1.3s cubic-bezier(0.16,1,0.3,1) 0.62s both; }
  .h-4 { animation: rise 1.2s cubic-bezier(0.16,1,0.3,1) 0.78s both; }
  .h-5 { animation: rise 1.1s cubic-bezier(0.16,1,0.3,1) 1.0s  both; }

  /* ── Floating orbs ── */
  @keyframes orb-a { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(24px,-32px) scale(1.06); } 66% { transform:translate(-16px,20px) scale(0.95); } }
  @keyframes orb-b { 0%,100% { transform:translate(0,0) scale(1); } 40% { transform:translate(-28px,18px) scale(0.94); } 75% { transform:translate(20px,-24px) scale(1.04); } }
  @keyframes orb-c { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(14px,26px) scale(1.03); } }
  .orb-a { animation: orb-a 11s ease-in-out infinite; }
  .orb-b { animation: orb-b 14s ease-in-out infinite; }
  .orb-c { animation: orb-c 8s  ease-in-out infinite; }

  /* ── Scroll cue ── */
  @keyframes drip { 0%,100% { transform:translateY(0); opacity:.3; } 55% { transform:translateY(8px); opacity:1; } }
  .drip { animation: drip 2.4s ease-in-out infinite; }

  /* ── Marquee ── */
  @keyframes mq { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  .mq { animation: mq 28s linear infinite; }

  /* ── Glitch (MW3B alias) ── */
  @keyframes glitch-1 { 0%,100%{clip-path:inset(0 0 95% 0);transform:translate(-3px,0)} 25%{clip-path:inset(40% 0 50% 0);transform:translate(3px,0)} 50%{clip-path:inset(70% 0 20% 0);transform:translate(-2px,0)} }
  @keyframes glitch-2 { 0%,100%{clip-path:inset(80% 0 5% 0);transform:translate(3px,0)} 25%{clip-path:inset(20% 0 70% 0);transform:translate(-3px,0)} 50%{clip-path:inset(55% 0 35% 0);transform:translate(2px,0)} }
  .glitch-wrap { position:relative; display:inline-block; }
  .glitch-wrap::before,
  .glitch-wrap::after {
    content: attr(data-text);
    position:absolute; inset:0;
    pointer-events:none; opacity:0;
    font-family: inherit; font-size: inherit; font-weight: inherit;
    letter-spacing: inherit; text-transform: inherit;
  }
  .glitch-wrap:hover::before { opacity:0.7; color:var(--ember); animation: glitch-1 0.4s steps(2) 1; }
  .glitch-wrap:hover::after  { opacity:0.7; color:var(--gold);  animation: glitch-2 0.4s steps(2) 1; }

  /* ── Navigation ── */
  .nav-item { position:relative; }
  .nav-item::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:var(--gold); transition: width 0.4s cubic-bezier(0.16,1,0.3,1); }
  .nav-item:hover::after { width:100%; }

  /* ── Buttons ── */
  .btn-primary {
    background: var(--gold); color: var(--bg);
    transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
    box-shadow: 0 0 0 0 rgba(191,155,69,0);
  }
  .btn-primary:hover {
    background: var(--gold-bright);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(191,155,69,0.22);
  }
  .btn-ghost {
    border: 1px solid var(--line-strong); color: var(--gold); background: transparent;
    transition: all 0.25s;
  }
  .btn-ghost:hover { background: var(--gold-faint); border-color: var(--gold); transform: translateY(-2px); }

  /* ── Work card ── */
  .work-card { transition: box-shadow 0.4s ease; will-change: transform; }
  .work-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.55); }

  /* ── Note card ── */
  .note-card { transition: background 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1); }
  .note-card:hover { background: var(--surface-2) !important; transform: translateY(-4px); }

  /* ── Offer card ── */
  .offer-card { transition: background 0.3s, border-color 0.3s; }
  .offer-card:hover { background: var(--surface-3) !important; border-color: var(--gold) !important; }

  /* ── Media card ── */
  .vid-thumb { overflow: hidden; }
  .vid-thumb-inner { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
  .vid-card:hover .vid-thumb-inner { transform: scale(1.04); }
  .play-btn { transition: transform 0.3s, background 0.3s; }
  .vid-card:hover .play-btn { transform: scale(1.15); background: rgba(191,155,69,0.18); }

  /* ── Credibility bar ── */
  .cred-tag { transition: color 0.25s, border-color 0.25s; }
  .cred-tag:hover { color: var(--gold-light) !important; border-color: var(--gold) !important; }

  /* ── Section divider ── */
  .rule { height:1px; border:none; background: linear-gradient(to right, transparent, var(--line-strong), transparent); }

  /* ── Form ── */
  .field {
    width:100%; background: var(--bg-warm);
    border: 1px solid var(--line-faint);
    color: var(--text); outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300;
    transition: border-color 0.3s, background 0.3s;
  }
  .field::placeholder { color: var(--text-4); }
  .field:focus { border-color: var(--gold); background: var(--surface); }
  .field option { background: var(--surface-2); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .about-cols  { grid-template-columns: 1fr !important; }
    .adv-cols    { grid-template-columns: 1fr !important; }
    .offer-cols  { grid-template-columns: 1fr !important; }
    .book-cols   { grid-template-columns: 1fr !important; }
    .form-row    { grid-template-columns: 1fr !important; }
    .footer-cols { flex-direction: column !important; gap: 32px !important; }
    .d-nav       { display: none !important; }
    .ham         { display: flex !important; }
    .work-cols   { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 580px) {
    .work-cols   { grid-template-columns: 1fr !important; }
    .notes-cols  { grid-template-columns: 1fr !important; }
    .vid-cols    { grid-template-columns: 1fr !important; }
    .cred-strip  { gap: 12px !important; }
  }

  /* Mobile: mobile menu animation */
  @keyframes mob-in { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:none} }
  .mob-menu { animation: mob-in 0.28s cubic-bezier(0.16,1,0.3,1) both; }
`;

// ─────────────────────────────────────────────────────────────
// CONTENT DATA  — edit here to update the site
// ─────────────────────────────────────────────────────────────

const NAV = ["Work", "Writing", "Adventures", "Media", "About"];

const CRED_CLIENTS = [
  "Red Bull India",
  "Museum of Goa",
  "TEDx Talks",
  "Rickshaw Run 2024",
  "The Buskers Club",
  "Goethe-Institut",
  "Artisans of Mumbai",
];

const WORK_FILTERS = [
  { id: "all", label: "Everything" },
  { id: "performance", label: "Performances" },
  { id: "brand", label: "Brand Work" },
  { id: "installation", label: "Installations" },
  { id: "activism", label: "Activism" },
];

const WORK = [
  {
    id: 1,
    cat: "performance",
    tag: "Performance · Goa · 2024",
    title: "Flow State, Monsoon Edition",
    desc: "A full fire-flow set performed mid-rainfall in a 300-person open courtyard. The brief was: don't die. The outcome was: something people are still talking about.",
    stat: "300 people",
    gradient:
      "radial-gradient(ellipse at 30% 40%, rgba(200,90,42,0.22), transparent 65%)",
    glyph: "🔥",
  },
  {
    id: 2,
    cat: "brand",
    tag: "Writing · Red Bull India · 2023",
    title: "Documenting the Underground",
    desc: "A three-part longform series for Red Bull India. Embedded journalism inside flow arts communities across Goa, Mumbai, and Dharamsala. Commissioned. Published. Shared widely.",
    stat: "3 features",
    gradient:
      "radial-gradient(ellipse at 65% 35%, rgba(191,155,69,0.18), transparent 65%)",
    glyph: "📝",
  },
  {
    id: 3,
    cat: "installation",
    tag: "Installation · Museum of Goa · 2023",
    title: "Kinetic Threads",
    desc: "A site-specific, motion-responsive installation commissioned for the Museum of Goa's summer programme. 200m of suspended thread, two spotlights, and one idea: that stillness is always moving.",
    stat: "6-week run",
    gradient:
      "radial-gradient(ellipse at 50% 60%, rgba(100,80,200,0.14), transparent 65%)",
    glyph: "🎨",
  },
  {
    id: 4,
    cat: "activism",
    tag: "Activism · Mumbai + Delhi + Kochi",
    title: "Art as Interruption",
    desc: "A series of unannounced street performances in high-density public spaces. No permits. No audience prep. No safety net. The work was about reclaiming attention in a world that never stops.",
    stat: "7 cities",
    gradient:
      "radial-gradient(ellipse at 40% 50%, rgba(191,155,69,0.12), transparent 65%)",
    glyph: "✊",
  },
  {
    id: 5,
    cat: "performance",
    tag: "Keynote Performance · Bangalore · 2023",
    title: "Navigating Chaos",
    desc: "A 45-minute corporate keynote for a 500-person audience — half live performance, half honest talk about creative decision-making. Not the kind of keynote anyone expected. Exactly why it worked.",
    stat: "500 attendees",
    gradient:
      "radial-gradient(ellipse at 55% 30%, rgba(200,90,42,0.16), transparent 65%)",
    glyph: "⚡",
  },
  {
    id: 6,
    cat: "installation",
    tag: "Group Show · Laxmi Projects, Mumbai",
    title: "Tactile Light",
    desc: "A four-artist collaborative installation exploring edges of perception. My contribution: a kinetic light rig that responds to breath. Shown for three weeks. Sold out on opening night.",
    stat: "4 artists",
    gradient:
      "radial-gradient(ellipse at 70% 55%, rgba(100,180,200,0.13), transparent 65%)",
    glyph: "💡",
  },
];

const NOTES = [
  {
    id: 1,
    title: "What flow arts actually taught me about being still",
    date: "March 2025",
    read: "5 min",
    tag: "Craft",
    excerpt:
      "The cruel paradox at the center of every movement practice: the harder you chase the state, the further it gets. Here's what six years of throwing objects at my own face taught me about letting go.",
  },
  {
    id: 2,
    title: "Gangtok to Kochi in a Rickshaw. Notes from the road.",
    date: "January 2025",
    read: "12 min",
    tag: "Adventure",
    excerpt:
      "3,000 km on three wheels with no plan, one co-driver, and a vehicle that kept threatening to retire. A dispatch from the Rickshaw Run.",
  },
  {
    id: 3,
    title:
      "Writing for Red Bull: what it means to translate something wordless",
    date: "November 2024",
    read: "7 min",
    tag: "Writing",
    excerpt:
      "When a mainstream brand wants to cover a subculture, something usually gets lost in translation. On trying to not be that loss.",
  },
  {
    id: 4,
    title: "Why I stopped explaining what I do at parties",
    date: "September 2024",
    read: "4 min",
    tag: "Identity",
    excerpt:
      "\"So what do you do?\" I used to give a different answer every time. Lately I've stopped answering at all. It's going better.",
  },
];

const VIDEOS = [
  {
    title: "Flow Set — Goa, Monsoon",
    sub: "Raw cut · 6 min",
    yt: "dQw4w9WgXcQ", // swap with real ID
    bg: "radial-gradient(ellipse at 30% 50%, rgba(200,90,42,0.25), transparent)",
  },
  {
    title: "Brand Reel — 2023 / 2024",
    sub: "Showreel · 3 min",
    yt: "dQw4w9WgXcQ",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(191,155,69,0.2), transparent)",
  },
  {
    title: "Museum of Goa — Installation",
    sub: "Documentary · 9 min",
    yt: "dQw4w9WgXcQ",
    bg: "radial-gradient(ellipse at 45% 55%, rgba(100,80,200,0.2), transparent)",
  },
];

const OFFERINGS = [
  {
    id: "perf",
    icon: "🎭",
    label: "Performances",
    title: "Live Fire & Flow",
    desc: "Solo sets or collaborative shows. Fire, poi, staff, silk — or a combination that doesn't have a name yet. For festivals, corporate events, brand activations, and private occasions.",
    note: "Indoor / outdoor / rain-proof",
  },
  {
    id: "workshop",
    icon: "🌀",
    label: "Workshops",
    title: "Flow State for Humans",
    desc: "A workshop that teaches the principles of flow through movement — not PowerPoint. Built for corporate teams, creative organisations, and groups who want something that actually works.",
    note: "Half-day or full-day formats",
  },
  {
    id: "brand",
    icon: "✦",
    label: "Brand Collaborations",
    title: "Creative Direction + Content",
    desc: "Art direction, long-form writing, content creation, brand storytelling — for brands that want something to mean something. Not PR. Not content marketing. Work.",
    note: "Red Bull, Museum of Goa, and others on request",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Omkar doesn't just perform — he changes the room. The keynote was the thing people talked about for months.",
    name: "Priya Mehta",
    role: "Head of Culture, Design Studio, Bangalore",
  },
  {
    quote:
      "Working with him on the Red Bull series was the easiest it's ever been to get something true out of a subculture story.",
    name: "Sid Rao",
    role: "Commissioning Editor, Red Bull India",
  },
];

// ─────────────────────────────────────────────────────────────
// TYPOGRAPHY SYSTEM
// ─────────────────────────────────────────────────────────────

const F = {
  serif: { fontFamily: "'Cormorant Garamond', serif" },
  mono: { fontFamily: "'DM Mono', monospace" },
  sans: { fontFamily: "'DM Sans', sans-serif" },
};

// ── OD Label ──────────────────────────────────────────────────
// Signals "Omkar Dhareshwar speaking" — professional, structured.
// The filled serif circle is the visual anchor for this voice.
function ODLabel({ children, style = {} }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
        ...style,
      }}
    >
      {/* Serif "O" pip — instantly readable identity marker */}
      <span
        style={{
          ...F.serif,
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--bg)",
          background: "var(--gold)",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          letterSpacing: 0,
          lineHeight: 1,
        }}
      >
        O
      </span>
      <span
        style={{
          ...F.mono,
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--gold)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ── MW3B Aside ─────────────────────────────────────────────────
// Signals "ManWith3Balls speaking" — raw, playful, artistic.
// Ember/terracotta separates it from OD's forest green at a glance.
function MW3BAside({ children, style = {} }) {
  return (
    <div
      style={{
        ...F.mono,
        fontSize: "11px",
        fontStyle: "italic",
        color: "var(--text-3)",
        lineHeight: 1.8,
        borderLeft: "2px solid var(--ember)",
        padding: "8px 14px",
        background: "rgba(196,98,29,0.04)",
        borderRadius: "0 4px 4px 0",
        ...style,
      }}
    >
      {/* MW3B tag — uppercase, ember, not italic so it reads as a label */}
      <span
        style={{
          ...F.mono,
          fontSize: "8px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ember)",
          marginRight: "8px",
          fontStyle: "normal",
        }}
      >
        MW3B ▸
      </span>
      {children}
    </div>
  );
}

function SectionHeading({ children, style = {} }) {
  return (
    <h2
      style={{
        ...F.serif,
        fontSize: "clamp(36px, 5.8vw, 66px)",
        fontWeight: 400,
        lineHeight: 1.05,
        color: "var(--text)",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

// ─────────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────

function Cursor() {
  // Three refs — one per ball
  const ball1Ref = useRef(null);
  const ball2Ref = useRef(null);
  const ball3Ref = useRef(null);
  const wrapRef  = useRef(null);

  // Live mouse target
  const posRef = useRef({ x: -100, y: -100 });

  // Each ball tracks its own smoothed position
  const b1 = useRef({ x: -100, y: -100 });
  const b2 = useRef({ x: -100, y: -100 });
  const b3 = useRef({ x: -100, y: -100 });

  const rafRef = useRef(null);

  useEffect(() => {
    // Don't run on touch screens
    if (window.matchMedia("(hover: none)").matches) return;

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    // Use event delegation — much more performant than per-element listeners
    const SELECTOR = "a, button, .work-card, .note-card, .offer-card, .vid-card, .cred-tag";
    const onOver = (e) => {
      if (e.target.closest(SELECTOR)) wrapRef.current?.classList.add("cursor-hovered");
    };
    const onOut = (e) => {
      if (e.target.closest(SELECTOR)) wrapRef.current?.classList.remove("cursor-hovered");
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    const loop = () => {
      // Ball 1 — snappiest, closest to real cursor position
      b1.current.x = lerp(b1.current.x, posRef.current.x, 0.35);
      b1.current.y = lerp(b1.current.y, posRef.current.y, 0.35);

      // Ball 2 — follows ball 1, creating a cascade
      b2.current.x = lerp(b2.current.x, b1.current.x, 0.22);
      b2.current.y = lerp(b2.current.y, b1.current.y, 0.22);

      // Ball 3 — trails furthest, the most juggle-like
      b3.current.x = lerp(b3.current.x, b2.current.x, 0.14);
      b3.current.y = lerp(b3.current.y, b2.current.y, 0.14);

      // Apply positions directly to DOM (no React re-render = no lag)
      if (ball1Ref.current) {
        ball1Ref.current.style.left = b1.current.x + "px";
        ball1Ref.current.style.top  = b1.current.y + "px";
      }
      if (ball2Ref.current) {
        ball2Ref.current.style.left = b2.current.x + "px";
        ball2Ref.current.style.top  = b2.current.y + "px";
      }
      if (ball3Ref.current) {
        ball3Ref.current.style.left = b3.current.x + "px";
        ball3Ref.current.style.top  = b3.current.y + "px";
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} id="cursor-wrap">
      <div id="ball-1" className="cursor-ball" ref={ball1Ref} />
      <div id="ball-2" className="cursor-ball" ref={ball2Ref} />
      <div id="ball-3" className="cursor-ball" ref={ball3Ref} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TILT CARD HOOK
// ─────────────────────────────────────────────────────────────

function useTilt() {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      ref.current.style.transition =
        "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
    }
  }, []);
  const onEnter = useCallback(() => {
    if (ref.current) ref.current.style.transition = "transform 0.1s linear";
  }, []);
  return {
    ref,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onMouseEnter: onEnter,
  };
}

// ─────────────────────────────────────────────────────────────
// TEXT SCRAMBLE HOOK
// ─────────────────────────────────────────────────────────────

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
function useScramble(target) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef(null);

  const scramble = useCallback(() => {
    let iter = 0;
    cancelAnimationFrame(frameRef.current);
    const run = () => {
      setDisplay(
        target
          .split("")
          .map((c, i) => {
            if (c === " ") return " ";
            if (i < iter) return target[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iter += 0.35;
      if (iter < target.length + 1)
        frameRef.current = requestAnimationFrame(run);
      else setDisplay(target);
    };
    frameRef.current = requestAnimationFrame(run);
  }, [target]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);
  return { display, scramble };
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────

function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          height: "62px",
          padding: "0 clamp(20px,5vw,56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(6,6,5,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
          borderBottom: scrolled ? "1px solid var(--line)" : "none",
          transition: "all 0.6s ease",
        }}
      >
        {/* Wordmark — both identities */}
        <a
          href="#"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              ...F.serif,
              fontSize: "20px",
              fontWeight: 500,
              color: "var(--gold)",
              letterSpacing: "0.05em",
            }}
          >
            Omkar
          </span>
          <span
            style={{
              ...F.mono,
              fontSize: "9px",
              color: "var(--text-3)",
              letterSpacing: "0.08em",
            }}
          >
            ×
          </span>
          <span
            style={{
              ...F.mono,
              fontSize: "9px",
              color: "var(--text-3)",
              letterSpacing: "0.1em",
            }}
          >
            MW3B
          </span>
        </a>

        {/* Desktop links */}
        <div
          className="d-nav"
          style={{ display: "flex", alignItems: "center", gap: "38px" }}
        >
          {NAV.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="nav-item"
              style={{
                ...F.mono,
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                textDecoration: "none",
                transition: "color 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-3)")
              }
            >
              {l}
            </a>
          ))}
          <a
            href="#book"
            className="btn-primary"
            style={{
              ...F.mono,
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "9px 22px",
              fontWeight: 400,
            }}
          >
            Let's work
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="ham"
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "none",
            flexDirection: "column",
            gap: "5px",
            background: "none",
            border: "none",
            padding: "6px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "20px",
                height: "1px",
                background: "var(--text-3)",
                transform: open
                  ? i === 0
                    ? "rotate(45deg) translate(4px,5.5px)"
                    : i === 2
                    ? "rotate(-45deg) translate(4px,-5.5px)"
                    : "scaleX(0)"
                  : "none",
                transition: "all 0.28s",
              }}
            />
          ))}
        </button>
      </nav>

      {open && (
        <div
          className="mob-menu"
          style={{
            position: "fixed",
            top: "62px",
            left: 0,
            right: 0,
            zIndex: 499,
            background: "rgba(6,6,5,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--line)",
            padding: "36px clamp(20px,5vw,56px)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {NAV.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{
                ...F.mono,
                fontSize: "13px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-2)",
                textDecoration: "none",
              }}
            >
              {l}
            </a>
          ))}
          <a
            href="#book"
            onClick={() => setOpen(false)}
            className="btn-primary"
            style={{
              ...F.mono,
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "13px 28px",
              display: "inline-block",
              alignSelf: "flex-start",
              marginTop: "8px",
            }}
          >
            Let's work together
          </a>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────

function Hero() {
  const { display, scramble } = useScramble("ManWith3Balls");

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px clamp(20px,6vw,80px) 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Breathing orbs — represent the three balls ── */}
      {/* Colors now match the new palette: forest green + ember */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>

        {/* Orb 1 — large, forest green, top-right */}
        <div
          className="orb-a"
          style={{
            position: "absolute",
            top: "8%",
            right: "5%",
            width: "clamp(240px,38vw,560px)",
            height: "clamp(240px,38vw,560px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 36% 36%, rgba(46,107,79,0.1), rgba(46,107,79,0.03) 50%, transparent 72%)",
            border: "1px solid rgba(46,107,79,0.07)",
          }}
        />

        {/* Orb 2 — medium, ember/terracotta, lower-right — MW3B accent */}
        <div
          className="orb-b"
          style={{
            position: "absolute",
            top: "55%",
            right: "16%",
            width: "clamp(120px,18vw,260px)",
            height: "clamp(120px,18vw,260px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,98,29,0.09), transparent 70%)",
            border: "1px solid rgba(196,98,29,0.06)",
          }}
        />

        {/* Orb 3 — small, forest green, mid-right */}
        <div
          className="orb-c"
          style={{
            position: "absolute",
            top: "28%",
            right: "2%",
            width: "clamp(56px,7vw,96px)",
            height: "clamp(56px,7vw,96px)",
            borderRadius: "50%",
            background: "rgba(46,107,79,0.05)",
            border: "1px solid rgba(46,107,79,0.12)",
          }}
        />

        {/* Faint horizontal rule — compositional anchor */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(46,107,79,0.06) 30%, rgba(46,107,79,0.06) 70%, transparent)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div style={{ position: "relative", maxWidth: "1000px" }}>
       {/* ── Identity header — OD × MW3B ── */}
        {/* Two names, one person. The scramble glitch on hover signals MW3B's chaotic energy. */}
        <div
          className="h-1"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "40px",
          }}
        >
          {/* OD name — serif, green, stable */}
          <span
            style={{
              ...F.serif,
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--gold)",
              letterSpacing: "0.06em",
            }}
          >
            Omkar Dhareshwar
          </span>

          {/* Separator */}
          <span
            style={{
              ...F.mono,
              fontSize: "10px",
              color: "var(--text-4)",
              letterSpacing: "0.1em",
            }}
          >
            ×
          </span>

          {/* MW3B alias — mono, glitches on hover, ember underline */}
          <span
            className="glitch-wrap"
            data-text={display}
            onMouseEnter={scramble}
            style={{
              ...F.mono,
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ember)",
              paddingBottom: "2px",
              borderBottom: "1px solid var(--ember)",
              opacity: 0.85,
            }}
          >
            {display}
          </span>
        </div>

        {/* OD name — massive, serif */}
        <h1
          className="h-2"
          style={{
            ...F.serif,
            fontSize: "clamp(64px, 13.5vw, 168px)",
            fontWeight: 300,
            lineHeight: 0.9,
            letterSpacing: "-0.025em",
            marginBottom: "36px",
          }}
        >
          Omkar
          <br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>
            Dhareshwar.
          </em>
        </h1>

        {/* Dual tagline — OD and MW3B together */}
        <div className="h-3" style={{ marginBottom: "56px" }}>
          <p
            style={{
              ...F.mono,
              fontSize: "clamp(10px,1.4vw,12px)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--text-3)",
              marginBottom: "8px",
            }}
          >
            Flow Artist · Performer · Activist · Storyteller
          </p>
          <MW3BAside style={{ marginTop: "10px", maxWidth: "420px" }}>
            I throw things for a living. Also: make art, write words, and
            occasionally go places I wasn't invited.
          </MW3BAside>
        </div>

        {/* CTAs */}
        <div
          className="h-4"
          style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
        >
          <a
            href="#work"
            className="btn-primary"
            style={{
              ...F.mono,
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "15px 40px",
              display: "inline-block",
            }}
          >
            See the work
          </a>
          <a
            href="#book"
            className="btn-ghost"
            style={{
              ...F.mono,
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "15px 40px",
              display: "inline-block",
            }}
          >
            Work with me
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="drip h-5"
        style={{
          position: "absolute",
          bottom: "44px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            ...F.mono,
            fontSize: "8px",
            color: "var(--text-4)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "40px",
            background:
              "linear-gradient(to bottom, var(--gold-dim), transparent)",
          }}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CREDIBILITY STRIP
// ─────────────────────────────────────────────────────────────

function CredStrip() {
  const items = [...CRED_CLIENTS, ...CRED_CLIENTS];
  return (
    <div
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--line-faint)",
        borderBottom: "1px solid var(--line-faint)",
        overflow: "hidden",
        padding: "16px 0",
      }}
    >
      <div
        style={{
          ...F.mono,
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: "var(--text-4)",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: "12px",
        }}
      >
        Work that's been trusted by
      </div>
      <div style={{ overflow: "hidden" }}>
        <div
          className="mq"
          style={{ display: "flex", width: "max-content", gap: "0" }}
        >
          {items.map((c, i) => (
            <div
              key={i}
              className="cred-tag"
              style={{
                ...F.mono,
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--text-3)",
                padding: "0 32px",
                borderRight: "1px solid var(--line-faint)",
                whiteSpace: "nowrap",
                transition: "all 0.25s",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────

function About() {
  return (
    <section
      id="about"
      style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          className="about-cols reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(48px,9vw,120px)",
            alignItems: "start",
          }}
        >
          {/* ── OD column — structured, credible ── */}
          <div>
            <ODLabel>About Omkar</ODLabel>
            <SectionHeading style={{ marginBottom: "28px" }}>
              I live and work
              <br />
              <em style={{ color: "var(--gold)" }}>at the edges.</em>
            </SectionHeading>

            <hr className="rule" style={{ margin: "28px 0", opacity: 0.5 }} />

            <p
              style={{
                color: "var(--text-2)",
                lineHeight: 1.9,
                fontSize: "15px",
                marginBottom: "18px",
              }}
            >
              I'm a flow artist, live performer, writer, and activist. I've
              performed for audiences of five and audiences of five hundred.
              I've created installations in formal gallery spaces and
              unannounced performances in train stations.
            </p>
            <p
              style={{
                color: "var(--text-2)",
                lineHeight: 1.9,
                fontSize: "15px",
                marginBottom: "18px",
              }}
            >
              My brand work includes commissioned longform for{" "}
              <strong style={{ color: "var(--gold-light)", fontWeight: 400 }}>
                Red Bull India
              </strong>
              , a site-specific installation for the{" "}
              <strong style={{ color: "var(--gold-light)", fontWeight: 400 }}>
                Museum of Goa
              </strong>
              , and corporate workshops for teams who want something that
              actually changes the room.
            </p>
            <p
              style={{
                color: "var(--text-2)",
                lineHeight: 1.9,
                fontSize: "15px",
              }}
            >
              I operate under the name{" "}
              <strong style={{ color: "var(--gold-light)", fontWeight: 400 }}>
                ManWith3Balls
              </strong>{" "}
              — a creative identity built to hold the experimental, the playful,
              and the parts of the work that resist easy categorisation.
            </p>

            {/* Pullquote */}
            <blockquote
              style={{
                margin: "40px 0 0",
                padding: "20px 0 0 22px",
                borderLeft: "2px solid var(--gold)",
              }}
            >
              <p
                style={{
                  ...F.serif,
                  fontSize: "clamp(20px,2.8vw,28px)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.35,
                  color: "var(--text)",
                }}
              >
                "Movement is how I think.
                <br />
                Performance is how I speak."
              </p>
            </blockquote>
          </div>

          {/* ── MW3B column — raw, personal ── */}
          <div>
            {/* Photo placeholder — believable gradient visual */}
            <div
              style={{
                width: "100%",
                aspectRatio: "3/4",
                background:
                  "linear-gradient(160deg, var(--surface-3) 0%, var(--surface) 60%, rgba(191,155,69,0.06) 100%)",
                border: "1px solid var(--line)",
                position: "relative",
                overflow: "hidden",
                marginBottom: "32px",
              }}
            >
              {/* Corner details */}
              {[
                { top: "18px", left: "18px" },
                { top: "18px", right: "18px" },
                { bottom: "18px", left: "18px" },
                { bottom: "18px", right: "18px" },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: "18px",
                    height: "18px",
                    borderTop: i < 2 ? "1px solid var(--gold)" : undefined,
                    borderBottom: i >= 2 ? "1px solid var(--gold)" : undefined,
                    borderLeft:
                      i % 2 === 0 ? "1px solid var(--gold)" : undefined,
                    borderRight:
                      i % 2 === 1 ? "1px solid var(--gold)" : undefined,
                    ...p,
                  }}
                />
              ))}
              {/* Decorative inner */}
              <div
                style={{
                  position: "absolute",
                  inset: "24px",
                  border: "1px solid var(--line-faint)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <div style={{ fontSize: "52px", opacity: 0.8 }}>🌊</div>
                <span
                  style={{
                    ...F.mono,
                    fontSize: "9px",
                    color: "var(--text-4)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Omkar in Goa, 2024
                </span>
              </div>
            </div>

            {/* MW3B voice block */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line-faint)",
                padding: "28px 28px 28px 24px",
                borderLeft: "2px solid var(--gold-dim)",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  ...F.mono,
                  fontSize: "9px",
                  color: "var(--gold)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                // MW3B speaking
              </div>
              <p
                style={{
                  ...F.mono,
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "var(--text-3)",
                  lineHeight: 1.85,
                }}
              >
                I've been doing this long enough to know that the best gigs are
                the ones where nobody in the room is sure what's about to happen
                — including me. That's where it gets interesting. That's where
                the work happens.
              </p>
            </div>

            {/* Stat grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: "var(--line-faint)",
              }}
            >
              {[
                ["5+", "years active"],
                ["500+", "live audience"],
                ["12+", "brand projects"],
                ["3", "gallery shows"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  style={{ background: "var(--bg)", padding: "20px 18px" }}
                >
                  <div
                    style={{
                      ...F.serif,
                      fontSize: "30px",
                      color: "var(--gold)",
                      fontWeight: 400,
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      ...F.mono,
                      fontSize: "9px",
                      color: "var(--text-3)",
                      letterSpacing: "0.14em",
                      marginTop: "6px",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// WORK — with 3D tilt cards
// ─────────────────────────────────────────────────────────────

function WorkCard({ item, delay }) {
  const tilt = useTilt();
  return (
    <div
      {...tilt}
      className={`work-card reveal reveal-d${delay}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line-faint)",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* ── Thumbnail ── */}
      {/* TO ADD A REAL PHOTO: set item.image = "/your-image.jpg" in the WORK data array above.
          If item.image is present it shows the photo. If not, it falls back to the gradient + glyph. */}
      <div
        style={{
          height: "220px",
          background: "var(--surface-3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {item.image ? (
          /* ── Real photo ── */
          <img
            src={item.image}
            alt={item.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        ) : (
          /* ── Gradient placeholder (until real photo added) ── */
          <>
            <div
              style={{ position: "absolute", inset: 0, background: item.gradient }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "52px",
                opacity: 0.7,
              }}
            >
              {item.glyph}
            </div>
          </>
        )}

        {/* Subtle dark overlay at bottom so badge text is always readable */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(to top, rgba(15,15,13,0.35), transparent)",
          }}
        />

        {/* Stat badge — light surface, not hardcoded dark */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            ...F.mono,
            fontSize: "9px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--gold)",
            background: "var(--surface)",
            padding: "5px 10px",
            border: "1px solid var(--border)",
          }}
        >
          {item.stat}
        </div>
      </div>

      {/* ── Text ── */}
      <div style={{ padding: "28px 26px 30px" }}>
        <div
          style={{
            ...F.mono,
            fontSize: "9px",
            color: "var(--text-3)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          {item.tag}
        </div>
        <h3
          style={{
            ...F.serif,
            fontSize: "23px",
            fontWeight: 500,
            lineHeight: 1.2,
            marginBottom: "12px",
            color: "var(--text)",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.85 }}
        >
          {item.desc}
        </p>

        {/* View project link */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderTop: "1px solid var(--line-faint)",
            paddingTop: "18px",
          }}
        >
          <span
            style={{
              ...F.mono,
              fontSize: "10px",
              color: "var(--gold)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            View project
          </span>
          <span style={{ color: "var(--gold)", fontSize: "13px" }}>→</span>
        </div>
      </div>
    </div>
  );
}

function Work() {
  const [active, setActive] = useState("all");
  const filtered =
    active === "all" ? WORK : WORK.filter((w) => w.cat === active);

  return (
    <section
      id="work"
      style={{
        padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)",
        background: "var(--bg-warm)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>The Work</ODLabel>
          <SectionHeading style={{ marginBottom: "12px" }}>
            Things I've made,
            <br />
            <em style={{ color: "var(--gold)" }}>done, and survived.</em>
          </SectionHeading>
          <MW3BAside style={{ marginBottom: "32px", maxWidth: "380px" }}>
            No vague "creative solutions" here. Real projects, real briefs, real
            outcomes.
          </MW3BAside>

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {WORK_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                style={{
                  ...F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  padding: "8px 18px",
                  border: "1px solid",
                  borderColor:
                    active === f.id ? "var(--gold)" : "var(--line-faint)",
                  background: active === f.id ? "var(--gold)" : "transparent",
                  color: active === f.id ? "var(--bg)" : "var(--text-3)",
                  transition: "all 0.25s",
                  fontFamily: "inherit",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          className="work-cols"
          style={{
            display: "grid",
            gap: "2px",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {filtered.map((item, i) => (
            <WorkCard key={item.id} item={item} delay={(i % 4) + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FIELD NOTES
// ─────────────────────────────────────────────────────────────

function FieldNotes() {
  const [featured, ...rest] = NOTES;
  return (
    <section
      id="writing"
      style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          className="reveal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "56px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <ODLabel>Writing</ODLabel>
            <SectionHeading>
              Thoughts that
              <br />
              <em style={{ color: "var(--gold)" }}>
                wouldn't fit in a caption.
              </em>
            </SectionHeading>
          </div>
          <div style={{ textAlign: "right" }}>
            <MW3BAside style={{ marginBottom: "10px" }}>
              I write when something refuses to leave me alone.
            </MW3BAside>
            <a
              href="#"
              style={{
                ...F.mono,
                fontSize: "10px",
                color: "var(--gold)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              All field notes →
            </a>
          </div>
        </div>

        {/* Featured note — large */}
        <div
          className="reveal note-card"
          style={{
            border: "1px solid var(--line-faint)",
            background: "var(--surface)",
            padding: "clamp(36px,5vw,60px)",
            marginBottom: "2px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span
                style={{
                  ...F.mono,
                  fontSize: "9px",
                  color: "var(--gold)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  padding: "5px 10px",
                  border: "1px solid var(--line)",
                  background: "var(--gold-faint)",
                }}
              >
                {featured.tag}
              </span>
              <span
                style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)" }}
              >
                Featured
              </span>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <span
                style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)" }}
              >
                {featured.date}
              </span>
              <span
                style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)" }}
              >
                {featured.read} read
              </span>
            </div>
          </div>
          <h3
            style={{
              ...F.serif,
              fontSize: "clamp(26px,4vw,44px)",
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: "20px",
              color: "var(--text)",
              maxWidth: "760px",
            }}
          >
            {featured.title}
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-2)",
              lineHeight: 1.85,
              maxWidth: "680px",
              marginBottom: "32px",
            }}
          >
            {featured.excerpt}
          </p>
          <span
            style={{
              ...F.mono,
              fontSize: "10px",
              color: "var(--gold)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Read the piece →
          </span>
        </div>

        {/* Remaining notes */}
        <div
          className="notes-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
          }}
        >
          {rest.map((note, i) => (
            <div
              key={note.id}
              className={`note-card reveal reveal-d${i + 1}`}
              style={{
                border: "1px solid var(--line-faint)",
                background: "var(--surface)",
                padding: "32px 28px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "22px",
                }}
              >
                <span
                  style={{
                    ...F.mono,
                    fontSize: "9px",
                    color: "var(--gold)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {note.tag}
                </span>
                <span
                  style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)" }}
                >
                  {note.read}
                </span>
              </div>
              <h4
                style={{
                  ...F.serif,
                  fontSize: "20px",
                  fontWeight: 400,
                  lineHeight: 1.3,
                  marginBottom: "14px",
                  color: "var(--text)",
                }}
              >
                {note.title}
              </h4>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--text-2)",
                  lineHeight: 1.8,
                }}
              >
                {note.excerpt}
              </p>
              <div
                style={{
                  marginTop: "24px",
                  ...F.mono,
                  fontSize: "10px",
                  color: "var(--gold)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Read →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ADVENTURES
// ─────────────────────────────────────────────────────────────

function Adventures() {
  return (
    <section
      id="adventures"
      style={{
        padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)",
        background: "var(--bg-warm)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>Adventures</ODLabel>
          <SectionHeading>
            Occasionally, I go
            <br />
            <em style={{ color: "var(--gold)" }}>completely off-script.</em>
          </SectionHeading>
          <MW3BAside style={{ marginTop: "14px", maxWidth: "400px" }}>
            The Rickshaw Run was not a safe decision. It was the right one.
          </MW3BAside>
        </div>

        {/* Feature card */}
        <div
          className="adv-cols reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: "1px solid var(--line)",
            overflow: "hidden",
          }}
        >
          {/* Visual */}
          <div
            style={{
              position: "relative",
              minHeight: "clamp(360px,55vw,620px)",
              background: "var(--surface-3)",
              overflow: "hidden",
            }}
          >
            {/* Atmospheric gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 25% 55%, rgba(200,90,42,0.22), rgba(191,155,69,0.06) 50%, transparent 75%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(255,255,255,0.012) 48px, rgba(255,255,255,0.012) 49px), repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,0.012) 48px, rgba(255,255,255,0.012) 49px)",
              }}
            />
            {/* Map-like route line */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.15,
              }}
              viewBox="0 0 400 500"
              preserveAspectRatio="none"
            >
              <path
                d="M 80 80 Q 200 120 160 200 Q 120 280 220 340 Q 300 380 280 440"
                stroke="var(--gold)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="6 4"
              />
              <circle cx="80" cy="80" r="5" fill="var(--gold)" />
              <circle cx="280" cy="440" r="5" fill="var(--ember)" />
            </svg>
            {/* Central icon */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "clamp(64px,13vw,108px)",
                  lineHeight: 1,
                  marginBottom: "14px",
                }}
              >
                🛺
              </div>
              <div
                style={{
                  ...F.mono,
                  fontSize: "9px",
                  color: "var(--text-3)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                Photography from the run
              </div>
            </div>
            {/* Route badge */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                ...F.mono,
                fontSize: "9px",
                color: "var(--ember)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "6px 12px",
                border: "1px solid rgba(200,90,42,0.3)",
                background: "rgba(6,6,5,0.8)",
              }}
            >
              Gangtok → Kochi · 3,000 km
            </div>
          </div>

          {/* Text */}
          <div
            style={{
              padding: "clamp(44px,7vw,80px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                ...F.mono,
                fontSize: "9px",
                color: "var(--ember)",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: "22px",
              }}
            >
              The Rickshaw Run · January 2024
            </div>
            <h3
              style={{
                ...F.serif,
                fontSize: "clamp(36px,5.5vw,56px)",
                fontWeight: 300,
                lineHeight: 1.02,
                marginBottom: "28px",
              }}
            >
              Gangtok to
              <br />
              Kochi.
              <br />
              <em style={{ color: "var(--gold)" }}>3,000 km.</em>
            </h3>
            <hr
              className="rule"
              style={{ marginBottom: "26px", opacity: 0.35 }}
            />
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-2)",
                lineHeight: 1.9,
                marginBottom: "18px",
              }}
            >
              A mechanical nightmare dressed as an adventure. We took a
              three-wheeled rickshaw — a vehicle designed for flat city roads —
              across mountain passes, river crossings, and highways that showed
              up only on paper.
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-2)",
                lineHeight: 1.9,
                marginBottom: "16px",
              }}
            >
              The engine died six times. We pushed it uphill twice. We ran out
              of diesel once and out of patience never.
            </p>
            <MW3BAside style={{ marginBottom: "36px" }}>
              Hardest thing I've done. Would do it again tomorrow.
            </MW3BAside>
            {/* Stats */}
            <div
              className="stats-row"
              style={{
                display: "flex",
                gap: "36px",
                marginBottom: "36px",
                flexWrap: "wrap",
              }}
            >
              {[
                ["3,000+", "km covered"],
                ["14", "days on road"],
                ["6", "engine deaths"],
                ["∞", "chai stops"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div
                    style={{
                      ...F.serif,
                      fontSize: "clamp(28px,4.5vw,40px)",
                      color: "var(--gold)",
                      fontWeight: 400,
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      ...F.mono,
                      fontSize: "9px",
                      color: "var(--text-3)",
                      letterSpacing: "0.12em",
                      marginTop: "7px",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
            <a
              href="#"
              style={{
                ...F.mono,
                fontSize: "10px",
                color: "var(--gold)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Read the full dispatch →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// MEDIA
// ─────────────────────────────────────────────────────────────

function Media() {
  return (
    <section
      id="media"
      style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>Media</ODLabel>
          <SectionHeading>
            Don't take my word
            <br />
            <em style={{ color: "var(--gold)" }}>for it.</em>
          </SectionHeading>
          <MW3BAside style={{ marginTop: "14px", maxWidth: "360px" }}>
            Three videos. None of them explain what I do. All of them show it.
          </MW3BAside>
        </div>

        <div
          className="vid-cols"
          style={{
            display: "grid",
            gap: "2px",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {VIDEOS.map((v, i) => (
            <div
              key={i}
              className={`vid-card reveal reveal-d${i + 1}`}
              style={{ cursor: "pointer" }}
            >
              {/* Thumbnail */}
              <div
                className="vid-thumb"
                style={{
                  aspectRatio: "16/9",
                  background: "var(--surface-3)",
                  position: "relative",
                  border: "1px solid var(--line-faint)",
                  marginBottom: "14px",
                }}
              >
                <div
                  className="vid-thumb-inner"
                  style={{ position: "absolute", inset: 0, background: v.bg }}
                />
                {/* Play button */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <div
                    className="play-btn"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      border: "1px solid rgba(191,155,69,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        marginLeft: "4px",
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "9px 0 9px 15px",
                        borderColor:
                          "transparent transparent transparent var(--gold)",
                      }}
                    />
                  </div>
                </div>
                {/* Index */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "12px",
                    ...F.mono,
                    fontSize: "8px",
                    color: "var(--text-3)",
                    letterSpacing: "0.2em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(VIDEOS.length).padStart(2, "0")}
                </div>
              </div>
              <div
                style={{
                  ...F.sans,
                  fontSize: "13.5px",
                  color: "var(--text)",
                  marginBottom: "5px",
                  fontWeight: 400,
                }}
              >
                {v.title}
              </div>
              <div
                style={{
                  ...F.mono,
                  fontSize: "9px",
                  color: "var(--text-3)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {v.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <div
      style={{
        padding: "0 clamp(20px,6vw,80px) clamp(60px,9vw,100px)",
        background: "var(--bg-warm)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
          gap: "2px",
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="reveal"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line-faint)",
              padding: "36px 32px",
            }}
          >
            <div
              style={{
                ...F.serif,
                fontSize: "clamp(16px,2vw,20px)",
                fontStyle: "italic",
                fontWeight: 300,
                lineHeight: 1.55,
                color: "var(--text)",
                marginBottom: "24px",
              }}
            >
              "{t.quote}"
            </div>
            <div>
              <div
                style={{
                  ...F.sans,
                  fontSize: "13px",
                  color: "var(--gold-light)",
                  fontWeight: 400,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  ...F.mono,
                  fontSize: "9px",
                  color: "var(--text-3)",
                  letterSpacing: "0.12em",
                  marginTop: "4px",
                }}
              >
                {t.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BOOK ME
// ─────────────────────────────────────────────────────────────

function BookMe() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const u = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.trim()) e.email = true;
    if (!form.message.trim()) e.message = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <section
      id="book"
      style={{
        padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)",
        background: "var(--surface)",
      }}
    >
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "72px" }}>
          <ODLabel>Work With Me</ODLabel>
          <SectionHeading style={{ marginBottom: "16px" }}>
            Got something worth
            <br />
            <em style={{ color: "var(--gold)" }}>building together?</em>
          </SectionHeading>
          <p
            style={{
              color: "var(--text-2)",
              fontSize: "15px",
              lineHeight: 1.85,
              maxWidth: "560px",
              marginBottom: "16px",
            }}
          >
            Brands, agencies, curators, festival programmers — if you've made it
            this far, you probably already know what you want. Tell me about it.
          </p>
          <MW3BAside>
            No deck required. An honest brief is worth more.
          </MW3BAside>
        </div>

        {/* Two-column layout */}
        <div
          className="book-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "start",
          }}
        >
          {/* Offerings */}
          <div>
            <div
              style={{
                ...F.mono,
                fontSize: "9px",
                color: "var(--text-3)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              What I offer
            </div>
            <div
              className="offer-cols"
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              {OFFERINGS.map((o) => (
                <div
                  key={o.id}
                  className="offer-card"
                  style={{
                    background: "var(--bg-warm)",
                    border: "1px solid var(--line-faint)",
                    padding: "28px 26px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "28px", marginTop: "2px" }}>
                      {o.icon}
                    </span>
                    <div>
                      <div
                        style={{
                          ...F.mono,
                          fontSize: "9px",
                          color: "var(--gold)",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        {o.label}
                      </div>
                      <div
                        style={{
                          ...F.serif,
                          fontSize: "19px",
                          fontWeight: 500,
                          marginBottom: "10px",
                          color: "var(--text)",
                        }}
                      >
                        {o.title}
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--text-2)",
                          lineHeight: 1.75,
                          marginBottom: "10px",
                        }}
                      >
                        {o.desc}
                      </p>
                      <div
                        style={{
                          ...F.mono,
                          fontSize: "9px",
                          color: "var(--text-3)",
                          letterSpacing: "0.12em",
                          borderTop: "1px solid var(--line-faint)",
                          paddingTop: "10px",
                        }}
                      >
                        {o.note}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <div
              style={{
                ...F.mono,
                fontSize: "9px",
                color: "var(--text-3)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Send a message
            </div>

            {sent ? (
              <div
                style={{
                  border: "1px solid var(--line)",
                  background: "var(--bg-warm)",
                  padding: "60px 40px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    ...F.serif,
                    fontSize: "54px",
                    color: "var(--gold)",
                    marginBottom: "16px",
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    ...F.serif,
                    fontSize: "26px",
                    color: "var(--text)",
                    marginBottom: "12px",
                  }}
                >
                  Message received.
                </div>
                <p
                  style={{
                    ...F.mono,
                    fontSize: "11px",
                    color: "var(--text-3)",
                    letterSpacing: "0.12em",
                    lineHeight: 1.7,
                  }}
                >
                  I read every message personally.
                  <br />
                  You'll hear from me within 48 hours.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  className="form-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <input
                    className="field"
                    placeholder="Your name"
                    value={form.name}
                    onChange={u("name")}
                    style={{
                      padding: "14px 16px",
                      outline: "none",
                      boxShadow: errors.name
                        ? "0 0 0 1px var(--ember)"
                        : "none",
                    }}
                  />
                  <input
                    className="field"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={u("email")}
                    style={{
                      padding: "14px 16px",
                      outline: "none",
                      boxShadow: errors.email
                        ? "0 0 0 1px var(--ember)"
                        : "none",
                    }}
                  />
                </div>
                <select
                  className="field"
                  value={form.type}
                  onChange={u("type")}
                  style={{
                    padding: "14px 16px",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="" disabled>
                    What kind of project?
                  </option>
                  <option value="performance">Live Performance</option>
                  <option value="workshop">Corporate Workshop</option>
                  <option value="brand">Brand Collaboration</option>
                  <option value="installation">
                    Installation / Exhibition
                  </option>
                  <option value="writing">Writing Commission</option>
                  <option value="other">Something else — let me explain</option>
                </select>
                <textarea
                  className="field"
                  placeholder="Tell me about your project. Budget, timeline, vibe — all useful."
                  value={form.message}
                  onChange={u("message")}
                  rows={6}
                  style={{
                    padding: "14px 16px",
                    resize: "vertical",
                    boxShadow: errors.message
                      ? "0 0 0 1px var(--ember)"
                      : "none",
                  }}
                />

                {/* Credibility micro-line */}
                <div
                  style={{
                    ...F.mono,
                    fontSize: "9px",
                    color: "var(--text-3)",
                    letterSpacing: "0.12em",
                    padding: "0 2px",
                  }}
                >
                  Past clients include Red Bull, Museum of Goa, TEDx. All
                  enquiries read personally.
                </div>

                <button
                  onClick={() => {
                    if (validate()) setSent(true);
                  }}
                  className="btn-primary"
                  style={{
                    ...F.mono,
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    padding: "15px 36px",
                    border: "none",
                    alignSelf: "flex-start",
                    marginTop: "6px",
                    fontFamily: "inherit",
                  }}
                >
                  Send it →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        padding: "clamp(44px,7vw,72px) clamp(20px,6vw,80px)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top row */}
        <div
          className="footer-cols"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                ...F.serif,
                fontSize: "36px",
                fontWeight: 300,
                color: "var(--gold)",
                lineHeight: 1,
                marginBottom: "12px",
              }}
            >
              Omkar <em style={{ color: "var(--text-3)" }}>×</em> MW3B
            </div>
            <MW3BAside style={{ maxWidth: "280px" }}>
              Two names. One person. Infinite excuses to make things.
            </MW3BAside>
          </div>

          {/* Nav + Social */}
          <div style={{ display: "flex", gap: "56px", flexWrap: "wrap" }}>
            <div>
              <div
                style={{
                  ...F.mono,
                  fontSize: "9px",
                  color: "var(--text-4)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Navigate
              </div>
              {NAV.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  style={{
                    display: "block",
                    ...F.mono,
                    fontSize: "10px",
                    color: "var(--text-3)",
                    textDecoration: "none",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                    transition: "color 0.25s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--gold)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}
                >
                  {l}
                </a>
              ))}
            </div>
            <div>
              <div
                style={{
                  ...F.mono,
                  fontSize: "9px",
                  color: "var(--text-4)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Find me
              </div>
              {["Instagram", "YouTube", "LinkedIn", "Substack"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    display: "block",
                    ...F.mono,
                    fontSize: "10px",
                    color: "var(--text-3)",
                    textDecoration: "none",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                    transition: "color 0.25s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--gold)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="rule" style={{ marginBottom: "28px", opacity: 0.3 }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span
            style={{
              ...F.mono,
              fontSize: "9px",
              color: "var(--text-4)",
              letterSpacing: "0.12em",
            }}
          >
            © 2025 Omkar Dhareshwar aka ManWith3Balls — All rights reserved
          </span>
          <a
            href="mailto:omkardhareshwar@gmail.com"
            style={{
              ...F.mono,
              fontSize: "10px",
              color: "var(--gold)",
              letterSpacing: "0.14em",
              textDecoration: "none",
              transition: "color 0.25s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--gold-light)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--gold)")}
          >
            omkardhareshwar@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// MARQUEE STRIP
// ─────────────────────────────────────────────────────────────

function MarqueeStrip() {
  const words = [
    "✦ Flow Arts",
    "— Performance",
    "✦ Activism",
    "— Installations",
    "✦ Brand Work",
    "— Storytelling",
    "✦ Workshops",
    "— Writing",
  ];
  const doubled = [...words, ...words, ...words, ...words];
  return (
    <div
      style={{
        overflow: "hidden",
        background: "var(--surface)",
        borderTop: "1px solid var(--line-faint)",
        borderBottom: "1px solid var(--line-faint)",
        padding: "13px 0",
      }}
    >
      <div
        className="mq"
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((w, i) => (
          <span
            key={i}
            style={{
              ...F.mono,
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: i % 2 === 0 ? "var(--text-3)" : "var(--gold-dim)",
              padding: "0 28px",
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Inject global CSS
    const tag = document.createElement("style");
    tag.id = "od-global-css";
    tag.textContent = CSS;
    document.head.appendChild(tag);

    // Scroll detection
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Intersection observer for reveals
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        }),
      { threshold: 0.07, rootMargin: "0px 0px -32px 0px" }
    );
    const observe = () =>
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const t = setTimeout(observe, 150);

    return () => {
      const existing = document.getElementById("od-global-css");
      if (existing) document.head.removeChild(existing);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <Cursor />
      <Navbar scrolled={scrolled} />
      <Hero />
      <CredStrip />
      <About />
      <MarqueeStrip />
      <Work />
      <FieldNotes />
      <Adventures />
      <Media />
      <Testimonials />
      <BookMe />
      <Footer />
    </>
  );
}
