/**
 * Omkar Dhareshwar × ManWith3Balls — Portfolio v3.0
 *
 * Design system:
 *  OD voice  → Cormorant Garamond, serif, structured, credible
 *  MW3B voice → DM Mono, raw, opinionated, slightly chaotic
 *
 * Standout interactions:
 *  1. Custom magnetic three-ball cursor (lerps, inflates on hover) — now respects prefers-reduced-motion
 *  2. 3D perspective tilt on work cards (per-card mouse tracking)
 *  3. Text scramble / glitch on the ManWith3Balls alias (hover)
 *
 * CHANGELOG v3.0 — Conversion + UX overhaul:
 *  + Hero rewritten: value-led headline ("Fire, flow, and stories...") + subhead + 3-tier CTA
 *  + NEW: Offerings section now rendered (Performances / Workshops / Brand Work) as 3-card segmenter
 *  + Page reorder: Hero → CredStrip → Offerings → Work → Press → Testimonials → Timeline → ...
 *  + NEW: ScrollProgress bar (top, 2px, gold)
 *  + NEW: SideRail nav (desktop, dot indicator, active section)
 *  + NEW: BackToTop button (mobile)
 *  + NEW: Active section state in top nav (driven by IntersectionObserver)
 *  + NEW: SEO meta tags + Person JSON-LD schema injected via useEffect
 *  + Cursor honors prefers-reduced-motion (falls back to native cursor)
 *  + CredStrip given a proper "Featured & trusted by" header
 *  + Mobile menu CTA wording updated; logo now jumps to #hero
 *  + A11y: semantic <main>, aria-labels on icon buttons, keyboard support on Press carousel
 *  + Typography: body weight 300 → 400, base size 16px, mono labels min 11px
 *  + Contrast: --text-4 darkened (#A09D96 → #87847C) to pass WCAG AA
 *  + New variables: --ember-text (darker for body text use)
 *  + Removed dead href="#" links (FieldNotes, Adventures dispatch)
 *  + MarqueeStrip kept in code but no longer rendered (replaced by Offerings)
 *
 * CHANGELOG v2.2:
 *  + Hero now contains trimmed About on the right (merged column)
 *  + NEW: Timeline section — reverse-chronology story spine with circular image nodes
 *  + Nav updated: "About" replaced with "Story" → links to #timeline
 *
 * CHANGELOG v2.1:
 *  + Press & Features section (carousel + featured cards + lightbox)
 *  + Contact section replaces BookMe (no form — prominent email + socials)
 *  + Mobile hamburger menu redesigned (light theme, readable text)
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// DATA IMPORTS (Phase 1 of componentization)
// ─────────────────────────────────────────────────────────────
import { NAV, navHref, SECTIONS } from "./data/nav";
import { CRED_CLIENTS } from "./data/credClients";
import { WORK, WORK_FILTERS } from "./data/work";
import { NOTES } from "./data/notes";
import { VIDEOS } from "./data/videos";
import { OFFERINGS } from "./data/offerings";
import { TESTIMONIALS } from "./data/testimonials";
import { TIMELINE } from "./data/timeline";
import { PRESS } from "./data/press";
import { SOCIALS } from "./data/socials";

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS & GLOBAL CSS
// ─────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

:root {
  --bg: #F8F6F1;
  --bg-warm: #F2EFE8;
  --surface: #FFFFFF;
  --surface-2: #F5F3EE;
  --surface-3: #EAE7DF;
  --gold: #2E6B4F;
  --gold-light: #4A9068;
  --gold-bright: #358A5F;
  --gold-dim: #1F4D38;
  --gold-faint: rgba(46,107,79,0.07);
  --ember: #C4621D;
  --ember-text: #A85215;     /* darker ember for body-sized text — passes 4.5:1 */
  --text: #0F0F0D;
  --text-2: #2C2C29;
  --text-3: #6B6860;
  --text-4: #87847C;          /* v3.0: darkened from #A09D96 — passes WCAG AA on bg */
  --text-dim: #2C2C29;
  --text-muted: #6B6860;
  --line: rgba(15,15,13,0.14);
  --line-faint: rgba(15,15,13,0.07);
  --line-strong: rgba(15,15,13,0.22);
  --border: rgba(46,107,79,0.2);
  --orange: #C4621D;
  /* Spacing tokens */
  --section-y: clamp(80px, 10vw, 140px);
  --section-x: clamp(20px, 6vw, 80px);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;            /* v3.0: was 300 — better readability */
  font-size: 16px;             /* v3.0: explicit base */
  line-height: 1.65;
  overflow-x: hidden;
  cursor: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Honor user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  body { cursor: auto !important; }
  #cursor-wrap { display: none !important; }
}

@media (hover: none) { body { cursor: auto; } }
a, button { cursor: none; }
@media (hover: none) { a, button { cursor: pointer; } }

::-webkit-scrollbar { width: 2px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--gold-dim); }

body::before {
  content: '';
  position: fixed; inset: 0; z-index: 9999;
  pointer-events: none;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
}

#cursor-wrap { pointer-events: none; }
@media (hover: none) {
  body { cursor: auto !important; }
  #cursor-wrap { display: none; }
}

.cursor-ball {
  position: fixed; top: 0; left: 0; z-index: 10000;
  border-radius: 50%; pointer-events: none;
  transform: translate(-50%, -50%);
  will-change: left, top;
}

#ball-1 { width: 11px; height: 11px; background: var(--gold); transition: width 0.2s ease, height 0.2s ease, background 0.2s ease; }
#ball-2 { width: 7px; height: 7px; background: var(--gold); opacity: 0.55; transition: width 0.2s ease, height 0.2s ease; }
#ball-3 { width: 5px; height: 5px; background: var(--ember); opacity: 0.5; transition: width 0.2s ease, height 0.2s ease; }

.cursor-hovered #ball-1 { width: 36px; height: 36px; background: var(--gold-faint); border: 1px solid var(--gold); }
.cursor-hovered #ball-2 { width: 11px; height: 11px; opacity: 0.7; }
.cursor-hovered #ball-3 { width: 8px; height: 8px; opacity: 0.6; }

.reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
.reveal.in { opacity: 1; transform: none; }
.reveal-d1 { transition-delay: 0.08s; }
.reveal-d2 { transition-delay: 0.18s; }
.reveal-d3 { transition-delay: 0.28s; }
.reveal-d4 { transition-delay: 0.40s; }

@keyframes rise { from { opacity:0; transform: translateY(42px); } to { opacity:1; transform: translateY(0); } }
.h-1 { animation: rise 1.3s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.h-2 { animation: rise 1.4s cubic-bezier(0.16,1,0.3,1) 0.42s both; }
.h-3 { animation: rise 1.3s cubic-bezier(0.16,1,0.3,1) 0.62s both; }
.h-4 { animation: rise 1.2s cubic-bezier(0.16,1,0.3,1) 0.78s both; }
.h-5 { animation: rise 1.1s cubic-bezier(0.16,1,0.3,1) 1.0s both; }

@keyframes orb-a { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(24px,-32px) scale(1.06); } 66% { transform:translate(-16px,20px) scale(0.95); } }
@keyframes orb-b { 0%,100% { transform:translate(0,0) scale(1); } 40% { transform:translate(-28px,18px) scale(0.94); } 75% { transform:translate(20px,-24px) scale(1.04); } }
@keyframes orb-c { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(14px,26px) scale(1.03); } }
.orb-a { animation: orb-a 11s ease-in-out infinite; }
.orb-b { animation: orb-b 14s ease-in-out infinite; }
.orb-c { animation: orb-c 8s ease-in-out infinite; }

@keyframes drip { 0%,100% { transform:translateY(0); opacity:.3; } 55% { transform:translateY(8px); opacity:1; } }
.drip { animation: drip 2.4s ease-in-out infinite; }

@keyframes mq { from { transform:translateX(0); } to { transform:translateX(-50%); } }
.mq { animation: mq 28s linear infinite; }

@keyframes glitch-1 { 0%,100%{clip-path:inset(0 0 95% 0);transform:translate(-3px,0)} 25%{clip-path:inset(40% 0 50% 0);transform:translate(3px,0)} 50%{clip-path:inset(70% 0 20% 0);transform:translate(-2px,0)} }
@keyframes glitch-2 { 0%,100%{clip-path:inset(80% 0 5% 0);transform:translate(3px,0)} 25%{clip-path:inset(20% 0 70% 0);transform:translate(-3px,0)} 50%{clip-path:inset(55% 0 35% 0);transform:translate(2px,0)} }
.glitch-wrap { position:relative; display:inline-block; }
.glitch-wrap::before, .glitch-wrap::after { content: attr(data-text); position:absolute; inset:0; pointer-events:none; opacity:0; font-family: inherit; font-size: inherit; font-weight: inherit; letter-spacing: inherit; text-transform: inherit; }
.glitch-wrap:hover::before { opacity:0.7; color:var(--ember); animation: glitch-1 0.4s steps(2) 1; }
.glitch-wrap:hover::after  { opacity:0.7; color:var(--gold); animation: glitch-2 0.4s steps(2) 1; }

.nav-item { position:relative; }
.nav-item::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:var(--gold); transition: width 0.4s cubic-bezier(0.16,1,0.3,1); }
.nav-item:hover::after { width:100%; }
.nav-item.active { color: var(--gold) !important; }
.nav-item.active::after { width: 100%; }

/* ── Scroll progress bar (top of viewport) ── */
.scroll-progress {
  position: fixed; top: 0; left: 0; right: 0;
  height: 2px; z-index: 600;
  transform-origin: left;
  background: linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-bright));
  pointer-events: none;
}

/* ── Side rail nav (desktop only) ── */
.side-rail {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 400; display: flex; flex-direction: column; gap: 14px;
}
.side-rail-item {
  display: flex; align-items: center; justify-content: flex-end; gap: 12px;
  text-decoration: none; cursor: none;
}
.side-rail-label {
  font-family: 'DM Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-3);
  opacity: 0; transform: translateX(8px);
  transition: opacity 0.25s, transform 0.25s;
}
.side-rail-item:hover .side-rail-label { opacity: 1; transform: translateX(0); }
.side-rail-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(135,132,124,0.4);
  transition: all 0.3s ease;
  flex-shrink: 0;
}
.side-rail-item:hover .side-rail-dot { background: var(--gold-light); transform: scale(1.4); }
.side-rail-item.active .side-rail-dot { background: var(--gold); transform: scale(1.5); box-shadow: 0 0 0 4px rgba(46,107,79,0.12); }
.side-rail-item.active .side-rail-label { opacity: 1; transform: translateX(0); color: var(--gold); }
@media (max-width: 1024px) { .side-rail { display: none !important; } }

/* ── Back-to-top (mobile only) ── */
.back-to-top {
  position: fixed; bottom: 24px; right: 24px; z-index: 400;
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--gold); color: var(--bg);
  border: none; display: flex; align-items: center; justify-content: center;
  font-family: 'DM Sans', sans-serif; font-size: 18px;
  cursor: pointer; box-shadow: 0 8px 24px rgba(46,107,79,0.28);
  opacity: 0; transform: translateY(12px); pointer-events: none;
  transition: opacity 0.3s, transform 0.3s, background 0.25s;
}
.back-to-top.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
.back-to-top:hover { background: var(--gold-bright); }
@media (min-width: 1025px) { .back-to-top { display: none !important; } }

/* ── Hero proof bar (logos / clients line beneath CTAs) ── */
.proof-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 18px 28px; opacity: 0.78; }
.proof-bar-item {
  font-family: 'DM Mono', monospace; font-size: 12px;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-3); white-space: nowrap;
}

/* ── Offerings cards ── */
.offer-tile {
  background: var(--bg); padding: clamp(28px,3.5vw,44px);
  border: 1px solid var(--line-faint);
  display: flex; flex-direction: column; gap: 16px;
  transition: background 0.3s, border-color 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1);
  cursor: pointer;
}
.offer-tile:hover { background: var(--surface-2); border-color: var(--gold); transform: translateY(-4px); }
.offer-tile-icon { font-size: 32px; line-height: 1; }

.btn-primary { background: var(--gold); color: var(--bg); transition: background 0.25s, transform 0.2s, box-shadow 0.25s; box-shadow: 0 0 0 0 rgba(191,155,69,0); }
.btn-primary:hover { background: var(--gold-bright); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(191,155,69,0.22); }
.btn-ghost { border: 1px solid var(--line-strong); color: var(--gold); background: transparent; transition: all 0.25s; }
.btn-ghost:hover { background: var(--gold-faint); border-color: var(--gold); transform: translateY(-2px); }

.work-card { transition: box-shadow 0.4s ease; will-change: transform; }
.work-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.55); }

.note-card { transition: background 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1); }
.note-card:hover { background: var(--surface-2) !important; transform: translateY(-4px); }

.offer-card { transition: background 0.3s, border-color 0.3s; }
.offer-card:hover { background: var(--surface-3) !important; border-color: var(--gold) !important; }

.vid-thumb { overflow: hidden; }
.vid-thumb-inner { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
.vid-card:hover .vid-thumb-inner { transform: scale(1.04); }
.play-btn { transition: transform 0.3s, background 0.3s; }
.vid-card:hover .play-btn { transform: scale(1.15); background: rgba(191,155,69,0.18); }

.cred-tag { transition: color 0.25s, border-color 0.25s; }
.cred-tag:hover { color: var(--gold-light) !important; border-color: var(--gold) !important; }

.rule { height:1px; border:none; background: linear-gradient(to right, transparent, var(--line-strong), transparent); }

.field { width:100%; background: var(--bg-warm); border: 1px solid var(--line-faint); color: var(--text); outline: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300; transition: border-color 0.3s, background 0.3s; }
.field::placeholder { color: var(--text-4); }
.field:focus { border-color: var(--gold); background: var(--surface); }
.field option { background: var(--surface-2); }

/* ── Press carousel — hide scrollbar ── */
.press-scroll { -ms-overflow-style: none; scrollbar-width: none; }
.press-scroll::-webkit-scrollbar { display: none; }

/* ── Press card hover ── */
.press-card { transition: box-shadow 0.35s ease; }
.press-card:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.45); }
.press-card:hover .press-img { transform: scale(1.04); }
.press-img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }

/* ── Social link rows ── */
.social-row { transition: padding-left 0.25s ease, border-bottom-color 0.25s ease; }
.social-row:hover { padding-left: 8px !important; border-bottom-color: var(--gold) !important; }

/* ── HERO grid (left = identity, right = trimmed about) ── */
.hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: clamp(32px,5vw,72px); align-items: center; max-width: 1300px; margin: 0 auto; width: 100%; }
.hero-about { border-left: 1px solid var(--line-faint); padding-left: clamp(24px,3vw,40px); }

/* ── TIMELINE — alternating spine ── */
.timeline-spine { position: relative; }
.timeline-spine .spine-line {
  position: absolute;
  left: 50%; top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent 0%, var(--gold) 6%, var(--gold) 94%, transparent 100%);
  opacity: 0.4;
  transform: translateX(-0.5px);
}
.timeline-row {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: start;
  margin-bottom: clamp(36px, 5.5vw, 64px);
}
.timeline-row > .tl-card    { grid-column: 3; padding-left: clamp(24px,4vw,48px); text-align: left; }
.timeline-row > .tl-spacer  { grid-column: 1; }
.timeline-row > .tl-node    { grid-column: 2; }
.timeline-row.row-flip > .tl-card    { grid-column: 1; padding-left: 0; padding-right: clamp(24px,4vw,48px); text-align: right; }
.timeline-row.row-flip > .tl-spacer  { grid-column: 3; }

.tl-node { display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 6px; position: relative; z-index: 2; }
.tl-node-year { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: var(--gold); text-transform: uppercase; white-space: nowrap; }
.tl-node-dot  { width: 12px; height: 12px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 0 4px var(--bg), 0 0 0 5px var(--gold); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.timeline-row:hover .tl-node-dot { transform: scale(1.3); box-shadow: 0 0 0 4px var(--bg), 0 0 0 5px var(--ember); }

.tl-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.timeline-row.row-flip .tl-head { flex-direction: row-reverse; }

.tl-img {
  width: 76px; height: 76px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(46,107,79,0.10), rgba(196,98,29,0.06));
  position: relative;
  transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.3s;
}
.timeline-row:hover .tl-img { transform: scale(1.05); border-color: var(--gold); }
.tl-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tl-img-fallback {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px; font-style: italic; font-weight: 400;
  color: var(--gold);
}
.tl-tag {
  font-family: 'DM Mono', monospace;
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--gold);
  padding: 4px 10px;
  border: 1px solid var(--border);
  background: var(--gold-faint);
  white-space: nowrap;
}
.tl-card h3 { font-family: 'Cormorant Garamond', serif; font-size: clamp(18px, 2.2vw, 23px); font-weight: 500; line-height: 1.25; color: var(--text); margin-bottom: 10px; }
.tl-card p  { font-size: 13.5px; color: var(--text-2); line-height: 1.85; }

.tl-origin { text-align: center; margin-top: 28px; position: relative; z-index: 2; }
.tl-origin-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--ember); box-shadow: 0 0 0 4px var(--bg), 0 0 0 5px var(--ember); }
.tl-origin-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--text-3); margin-top: 12px; }

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
  /* Featured note — stack image above text on mobile */
  .featured-note { grid-template-columns: 1fr !important; }
  .featured-note-img { order: -1; }
  /* Press featured — stack on mobile */
  .press-featured { grid-template-columns: 1fr !important; }

  /* Hero — stack vertically on mobile */
  .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
  .hero-about { border-left: none !important; padding-left: 0 !important; border-top: 1px solid var(--line-faint); padding-top: 36px; }

  /* Timeline — single-spine layout on mobile */
  .timeline-spine .spine-line { left: 24px !important; transform: none !important; }
  .timeline-row, .timeline-row.row-flip { grid-template-columns: 48px 1fr !important; }
  .timeline-row > .tl-node, .timeline-row.row-flip > .tl-node { grid-column: 1 !important; }
  .timeline-row > .tl-card, .timeline-row.row-flip > .tl-card { grid-column: 2 !important; padding: 0 0 0 16px !important; text-align: left !important; }
  .timeline-row > .tl-spacer, .timeline-row.row-flip > .tl-spacer { display: none !important; }
  .timeline-row.row-flip .tl-head { flex-direction: row !important; }
  .tl-origin { text-align: left !important; padding-left: 19px; }
}
@media (max-width: 580px) {
  .work-cols   { grid-template-columns: 1fr !important; }
  .notes-cols  { grid-template-columns: 1fr !important; }
  .vid-cols    { grid-template-columns: 1fr !important; }
  .cred-strip  { gap: 12px !important; }
}

@keyframes mob-in { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:none} }
.mob-menu { animation: mob-in 0.28s cubic-bezier(0.16,1,0.3,1) both; }
`;

// ─────────────────────────────────────────────────────────────
// CONTENT DATA — extracted to /src/data/ in Phase 1
//   See: ./data/nav.js, ./data/work.js, ./data/notes.js, etc.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// TYPOGRAPHY SYSTEM
// ─────────────────────────────────────────────────────────────
const F = {
  serif: { fontFamily: "'Cormorant Garamond', serif" },
  mono:  { fontFamily: "'DM Mono', monospace" },
  sans:  { fontFamily: "'DM Sans', sans-serif" },
};

function ODLabel({ children, style = {} }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px", ...style }}>
      <span style={{ ...F.serif, fontSize: "11px", fontWeight: 600, color: "var(--bg)", background: "var(--gold)", width: "22px", height: "22px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, letterSpacing: 0, lineHeight: 1 }}>O</span>
      <span style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>{children}</span>
    </div>
  );
}

function MW3BAside({ children, style = {} }) {
  return (
    <div style={{ ...F.mono, fontSize: "12px", fontStyle: "italic", color: "var(--text-3)", lineHeight: 1.8, borderLeft: "2px solid var(--ember)", padding: "8px 14px", background: "rgba(196,98,29,0.04)", borderRadius: "0 4px 4px 0", ...style }}>
      <span style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ember)", marginRight: "8px", fontStyle: "normal" }}>MW3B ▸</span>
      {children}
    </div>
  );
}

function SectionHeading({ children, style = {} }) {
  return (
    <h2 style={{ ...F.serif, fontSize: "clamp(36px, 5.8vw, 66px)", fontWeight: 400, lineHeight: 1.05, color: "var(--text)", ...style }}>
      {children}
    </h2>
  );
}

// ─────────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────
function Cursor() {
  const ball1Ref = useRef(null);
  const ball2Ref = useRef(null);
  const ball3Ref = useRef(null);
  const wrapRef  = useRef(null);
  const posRef   = useRef({ x: -100, y: -100 });
  const b1 = useRef({ x: -100, y: -100 });
  const b2 = useRef({ x: -100, y: -100 });
  const b3 = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lerp = (a, b, t) => a + (b - a) * t;
    const onMove = (e) => { posRef.current = { x: e.clientX, y: e.clientY }; };
    const SELECTOR = "a, button, .work-card, .note-card, .offer-card, .vid-card, .cred-tag, .press-card, .timeline-row";
    const onOver = (e) => { if (e.target.closest(SELECTOR)) wrapRef.current?.classList.add("cursor-hovered"); };
    const onOut  = (e) => { if (e.target.closest(SELECTOR)) wrapRef.current?.classList.remove("cursor-hovered"); };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    const loop = () => {
      b1.current.x = lerp(b1.current.x, posRef.current.x, 0.35);
      b1.current.y = lerp(b1.current.y, posRef.current.y, 0.35);
      b2.current.x = lerp(b2.current.x, b1.current.x, 0.22);
      b2.current.y = lerp(b2.current.y, b1.current.y, 0.22);
      b3.current.x = lerp(b3.current.x, b2.current.x, 0.14);
      b3.current.y = lerp(b3.current.y, b2.current.y, 0.14);
      if (ball1Ref.current) { ball1Ref.current.style.left = b1.current.x + "px"; ball1Ref.current.style.top = b1.current.y + "px"; }
      if (ball2Ref.current) { ball2Ref.current.style.left = b2.current.x + "px"; ball2Ref.current.style.top = b2.current.y + "px"; }
      if (ball3Ref.current) { ball3Ref.current.style.left = b3.current.x + "px"; ball3Ref.current.style.top = b3.current.y + "px"; }
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
  const onMove  = useCallback((e) => { const card = ref.current; if (!card) return; const rect = card.getBoundingClientRect(); const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12; const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12; card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`; }, []);
  const onLeave = useCallback(() => { if (ref.current) { ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)"; ref.current.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)"; } }, []);
  const onEnter = useCallback(() => { if (ref.current) ref.current.style.transition = "transform 0.1s linear"; }, []);
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave, onMouseEnter: onEnter };
}

// ─────────────────────────────────────────────────────────────
// TEXT SCRAMBLE HOOK
// ─────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
function useScramble(target) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef(null);
  const scramble = useCallback(() => {
    let iter = 0;
    cancelAnimationFrame(frameRef.current);
    const run = () => {
      setDisplay(target.split("").map((c, i) => { if (c === " ") return " "; if (i < iter) return target[i]; return CHARS[Math.floor(Math.random() * CHARS.length)]; }).join(""));
      iter += 0.35;
      if (iter < target.length + 1) frameRef.current = requestAnimationFrame(run);
      else setDisplay(target);
    };
    frameRef.current = requestAnimationFrame(run);
  }, [target]);
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);
  return { display, scramble };
}

// ─────────────────────────────────────────────────────────────
// useActiveSection v3.0 — IntersectionObserver-based scroll spy
// ─────────────────────────────────────────────────────────────
function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || "");
  useEffect(() => {
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(id); }),
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds.join(",")]);
  return active;
}

// ─────────────────────────────────────────────────────────────
// ScrollProgress v3.0 — top bar showing read progress
// ─────────────────────────────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${pct / 100})` }} aria-hidden="true" />;
}

// ─────────────────────────────────────────────────────────────
// SideRail v3.0 — desktop dot navigation (right side, vertical)
// ─────────────────────────────────────────────────────────────
function SideRail({ activeSection, sections }) {
  return (
    <nav className="side-rail" aria-label="Section navigation">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`side-rail-item${activeSection === s.id ? " active" : ""}`}
          aria-label={`Jump to ${s.label}`}
          aria-current={activeSection === s.id ? "true" : undefined}
        >
          <span className="side-rail-label">{s.label}</span>
          <span className="side-rail-dot" />
        </a>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// BackToTop v3.0 — mobile-only floating button
// ─────────────────────────────────────────────────────────────
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={`back-to-top${show ? " show" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// SEOHead v3.0 — sets document title + meta tags + Person JSON-LD
// (Drop-in for SPA. Replace with react-helmet-async after componentization.)
// ─────────────────────────────────────────────────────────────
function useSEO() {
  useEffect(() => {
    document.title = "Omkar Dhareshwar — Flow Artist, Performer & Storyteller, Mumbai";

    const ensure = (selector, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(attrs.tag);
        document.head.appendChild(el);
      }
      Object.keys(attrs).forEach((k) => { if (k !== "tag") el.setAttribute(k, attrs[k]); });
      return el;
    };

    ensure('meta[name="description"]', { tag: "meta", name: "description", content: "Fire performances, corporate flow workshops, and brand storytelling. Featured in Nat Geo Traveller, Red Bull, Britannia, and Doordarshan. Based in Mumbai." });
    ensure('meta[name="keywords"]', { tag: "meta", name: "keywords", content: "flow artist mumbai, fire performer india, corporate juggling workshop, flow workshop mumbai, manwith3balls, omkar dhareshwar, marol art village, street art mumbai, brand storytelling india" });
    ensure('meta[name="author"]', { tag: "meta", name: "author", content: "Omkar Dhareshwar" });
    ensure('meta[name="theme-color"]', { tag: "meta", name: "theme-color", content: "#2E6B4F" });
    ensure('meta[name="viewport"]', { tag: "meta", name: "viewport", content: "width=device-width, initial-scale=1" });

    // Open Graph
    ensure('meta[property="og:type"]', { tag: "meta", property: "og:type", content: "profile" });
    ensure('meta[property="og:title"]', { tag: "meta", property: "og:title", content: "Omkar Dhareshwar — Flow Artist & Performer" });
    ensure('meta[property="og:description"]', { tag: "meta", property: "og:description", content: "Fire, flow, and stories that actually mean something." });
    ensure('meta[property="og:url"]', { tag: "meta", property: "og:url", content: "https://www.omkardhareshwar.com" });
    ensure('meta[property="og:image"]', { tag: "meta", property: "og:image", content: "https://www.omkardhareshwar.com/og-image.jpg" });
    ensure('meta[property="og:site_name"]', { tag: "meta", property: "og:site_name", content: "Omkar Dhareshwar" });

    // Twitter
    ensure('meta[name="twitter:card"]', { tag: "meta", name: "twitter:card", content: "summary_large_image" });
    ensure('meta[name="twitter:title"]', { tag: "meta", name: "twitter:title", content: "Omkar Dhareshwar — Flow Artist & Performer" });
    ensure('meta[name="twitter:description"]', { tag: "meta", name: "twitter:description", content: "Fire, flow, and stories that actually mean something." });
    ensure('meta[name="twitter:image"]', { tag: "meta", name: "twitter:image", content: "https://www.omkardhareshwar.com/og-image.jpg" });

    // Canonical
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", "https://www.omkardhareshwar.com");

    // Person JSON-LD schema
    let schema = document.getElementById("od-person-schema");
    if (!schema) {
      schema = document.createElement("script");
      schema.id = "od-person-schema";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Omkar Dhareshwar",
      alternateName: "ManWith3Balls",
      jobTitle: "Flow Artist, Performer & Storyteller",
      url: "https://www.omkardhareshwar.com",
      email: "mailto:omkar.dhara@gmail.com",
      sameAs: SOCIALS.map((s) => s.href),
      address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "MH", addressCountry: "IN" },
      knowsAbout: ["Flow Arts", "Juggling", "Fire Performance", "Street Art", "Brand Storytelling", "Performance Art"],
    });

    return () => {
      // We don't strip meta on unmount — they're meant to persist for crawlers.
    };
  }, []);
}

// ─────────────────────────────────────────────────────────────
// NAVBAR — uses navHref() so "Story" routes to #timeline
// v3.0: now receives activeSection for active-state underline
// ─────────────────────────────────────────────────────────────
function Navbar({ scrolled, activeSection }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, height: "62px", padding: "0 clamp(20px,5vw,56px)", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(248,246,241,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none", borderBottom: scrolled ? "1px solid var(--line-faint)" : "none", transition: "all 0.6s ease" }} role="navigation" aria-label="Primary">
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }} aria-label="Home">
          <span style={{ ...F.serif, fontSize: "20px", fontWeight: 500, color: "var(--gold)", letterSpacing: "0.05em" }}>Omkar</span>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.08em" }}>×</span>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.1em" }}>MW3B</span>
        </a>

        <div className="d-nav" style={{ display: "flex", alignItems: "center", gap: "38px" }}>
          {NAV.map((l) => {
            const id = navHref(l).slice(1);
            const isActive = activeSection === id;
            return (
              <a key={l} href={navHref(l)} className={`nav-item${isActive ? " active" : ""}`} style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: isActive ? "var(--gold)" : "var(--text-3)", textDecoration: "none", transition: "color 0.25s" }} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text)"; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text-3)"; }}>{l}</a>
            );
          })}
          <a href="#book" className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "9px 22px", fontWeight: 400 }}>Let's work</a>
        </div>

        <button className="ham" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} style={{ display: "none", flexDirection: "column", gap: "5px", background: "none", border: "none", padding: "6px" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: "block", width: "20px", height: "1px", background: "var(--text-3)", transform: open ? i === 0 ? "rotate(45deg) translate(4px,5.5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5.5px)" : "scaleX(0)" : "none", transition: "all 0.28s" }} />
          ))}
        </button>
      </nav>

      {/* ── Mobile menu — light cream theme ── */}
      {open && (
        <div className="mob-menu" style={{ position: "fixed", top: "62px", left: 0, right: 0, zIndex: 499, background: "rgba(248,246,241,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--line)", padding: "36px clamp(20px,5vw,56px)", display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV.map((l) => (
            <a key={l} href={navHref(l)} onClick={() => setOpen(false)} style={{ ...F.mono, fontSize: "13px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid var(--line-faint)", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}>{l}</a>
          ))}
          <a href="#book" onClick={() => setOpen(false)} className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "13px 28px", display: "inline-block", alignSelf: "flex-start", marginTop: "20px" }}>Let's work together</a>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO v3.0 — value-led headline + 3-tier CTA + proof bar
// ─────────────────────────────────────────────────────────────
function Hero() {
  const { display, scramble } = useScramble("ManWith3Balls");

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px clamp(20px,6vw,80px) 80px", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
        <div className="orb-a" style={{ position: "absolute", top: "8%", right: "5%", width: "clamp(240px,38vw,560px)", height: "clamp(240px,38vw,560px)", borderRadius: "50%", background: "radial-gradient(circle at 36% 36%, rgba(46,107,79,0.1), rgba(46,107,79,0.03) 50%, transparent 72%)", border: "1px solid rgba(46,107,79,0.07)" }} />
        <div className="orb-b" style={{ position: "absolute", top: "55%", right: "16%", width: "clamp(120px,18vw,260px)", height: "clamp(120px,18vw,260px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,98,29,0.09), transparent 70%)", border: "1px solid rgba(196,98,29,0.06)" }} />
        <div className="orb-c" style={{ position: "absolute", top: "28%", right: "2%", width: "clamp(56px,7vw,96px)", height: "clamp(56px,7vw,96px)", borderRadius: "50%", background: "rgba(46,107,79,0.05)", border: "1px solid rgba(46,107,79,0.12)" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(46,107,79,0.06) 30%, rgba(46,107,79,0.06) 70%, transparent)" }} />
      </div>

      <div className="hero-grid" style={{ position: "relative" }}>

        {/* LEFT — Identity + value prop + CTAs */}
        <div>
          {/* Eyebrow */}
          <div className="h-1" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px", flexWrap: "wrap" }}>
            <span style={{ ...F.serif, fontSize: "14px", fontWeight: 500, color: "var(--gold)", letterSpacing: "0.04em" }}>Omkar Dhareshwar</span>
            <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.1em" }}>×</span>
            <span className="glitch-wrap" data-text={display} onMouseEnter={scramble} style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ember)", paddingBottom: "2px", borderBottom: "1px solid var(--ember)", opacity: 0.9 }}>{display}</span>
            <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase", marginLeft: "auto", paddingLeft: "12px" }}>Mumbai · IN</span>
          </div>

          {/* Headline — benefit-led, ladders to all three offerings */}
          <h1 className="h-2" style={{ ...F.serif, fontSize: "clamp(44px, 7.5vw, 96px)", fontWeight: 300, lineHeight: 0.98, letterSpacing: "-0.02em", marginBottom: "28px", maxWidth: "920px" }}>
            Fire, flow, and stories that<br />
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>actually mean something.</em>
          </h1>

          {/* Subhead — one-liner: what + for whom + promise */}
          <p className="h-3" style={{ ...F.sans, fontSize: "clamp(16px,1.55vw,19px)", lineHeight: 1.65, color: "var(--text-2)", maxWidth: "640px", marginBottom: "32px", fontWeight: 400 }}>
            I perform, run flow workshops, and direct culture-led brand work — for festivals, companies, and brands that want something memorable, not forgettable.
          </p>

          {/* MW3B aside */}
          <div className="h-3" style={{ marginBottom: "36px" }}>
            <MW3BAside style={{ maxWidth: "440px" }}>Mechanical engineer by degree. Everything else by choice. Turns out the best use of an engineering brain is knowing which rules to break.</MW3BAside>
          </div>

          {/* CTAs — 3-tier hierarchy */}
          <div className="h-4" style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "44px" }}>
            <a href="#offerings" className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "16px 36px", display: "inline-block", fontWeight: 500 }}>Book a performance →</a>
            <a href="#work" className="btn-ghost" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "16px 32px", display: "inline-block" }}>See the work</a>
            <a href="#timeline" style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", textDecoration: "none", marginLeft: "6px", paddingBottom: "2px", borderBottom: "1px solid var(--line-faint)", transition: "color 0.25s, border-color 0.25s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderBottomColor = "var(--gold)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderBottomColor = "var(--line-faint)"; }}>or read the story →</a>
          </div>

          {/* Proof bar — above the fold */}
          <div className="h-5" style={{ borderTop: "1px solid var(--line-faint)", paddingTop: "20px" }}>
            <div style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "14px" }}>Featured & trusted by</div>
            <div className="proof-bar">
              {["Nat Geo Traveller", "Red Bull India", "Britannia", "Doordarshan", "Museum of Goa", "Mid-Day"].map((n) => (
                <span key={n} className="proof-bar-item">{n}</span>
              ))}
              <span className="proof-bar-item" style={{ color: "var(--gold)" }}>+ 6 more</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Brief about + stats + closing quote */}
        <aside className="hero-about h-5">
          <div style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "18px" }}>About</div>

          <p style={{ ...F.serif, fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 300, lineHeight: 1.35, color: "var(--text)", marginBottom: "20px", fontStyle: "italic" }}>
            I live and work <span style={{ color: "var(--gold)" }}>at the edges.</span>
          </p>

          <p style={{ color: "var(--text-2)", lineHeight: 1.85, fontSize: "14.5px", marginBottom: "14px" }}>
            Flow artist, live performer, writer, activist. Audiences of five, audiences of five hundred. Gallery installations and unannounced train-station performances.
          </p>

          <p style={{ color: "var(--text-2)", lineHeight: 1.85, fontSize: "14.5px", marginBottom: "26px" }}>
            Brand work for{" "}
            <a href="https://www.redbull.com/in-en" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-light)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Red Bull India</a>
            ,{" "}
            <a href="https://museumofgoa.com/program/homo-ludens-the-art-of-play/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-light)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Museum of Goa</a>
            , and corporate workshops that change the room.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1px", background: "var(--line-faint)", marginBottom: "24px" }}>
            {[["10+", "yrs"], ["500+", "murals"], ["12+", "publications"], ["3,000km", "rickshaw"]].map(([n, l]) => (
              <div key={l} style={{ background: "var(--bg)", padding: "14px 6px", textAlign: "center" }}>
                <div style={{ ...F.serif, fontSize: "22px", color: "var(--gold)", fontWeight: 400, lineHeight: 1 }}>{n}</div>
                <div style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.12em", marginTop: "5px", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>

          <blockquote style={{ borderLeft: "2px solid var(--gold)", paddingLeft: "16px" }}>
            <p style={{ ...F.serif, fontSize: "15px", fontStyle: "italic", fontWeight: 300, lineHeight: 1.45, color: "var(--text-2)" }}>
              "Movement is how I think.<br />Performance is how I speak."
            </p>
          </blockquote>
        </aside>
      </div>

      <div className="drip h-5" style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }} aria-hidden="true">
        <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, var(--gold-dim), transparent)" }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CREDIBILITY STRIP v3.0 — improved label + spacing
// ─────────────────────────────────────────────────────────────
function CredStrip() {
  const items = [...CRED_CLIENTS, ...CRED_CLIENTS];
  return (
    <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line-faint)", borderBottom: "1px solid var(--line-faint)", overflow: "hidden", padding: "20px 0" }}>
      <div style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.22em", color: "var(--text-3)", textTransform: "uppercase", textAlign: "center", marginBottom: "14px" }}>Work that's been trusted by</div>
      <div style={{ overflow: "hidden" }} aria-label="Client logos marquee">
        <div className="mq" style={{ display: "flex", width: "max-content", gap: "0" }}>
          {items.map((c, i) => (
            <div key={i} className="cred-tag" style={{ ...F.mono, fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", padding: "0 32px", borderRight: "1px solid var(--line-faint)", whiteSpace: "nowrap", transition: "all 0.25s" }}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OFFERINGS v3.0 — NEW. Three-door segmenter (Performances / Workshops / Brand)
// ─────────────────────────────────────────────────────────────
function Offerings() {
  return (
    <section id="offerings" style={{ padding: "var(--section-y) var(--section-x)", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px", maxWidth: "760px" }}>
          <ODLabel>Work With Me</ODLabel>
          <SectionHeading style={{ marginBottom: "18px" }}>Three ways<br /><em style={{ color: "var(--gold)" }}>we can work together.</em></SectionHeading>
          <p style={{ color: "var(--text-2)", fontSize: "16px", lineHeight: 1.75, marginBottom: "14px", maxWidth: "620px" }}>
            Pick the door that fits your event, team, or brand. Or just write to me — we'll figure it out together.
          </p>
          <MW3BAside style={{ maxWidth: "440px" }}>No deck required. An honest brief is worth more.</MW3BAside>
        </div>

        <div className="offer-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "var(--line-faint)" }}>
          {OFFERINGS.map((o, i) => (
            <a
              key={o.id}
              href="#book"
              className={`offer-tile reveal reveal-d${i + 1}`}
              style={{ textDecoration: "none" }}
              aria-label={`Enquire about ${o.label}`}
            >
              <div className="offer-tile-icon" aria-hidden="true">{o.icon}</div>
              <div style={{ ...F.mono, fontSize: "11px", color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{o.label}</div>
              <h3 style={{ ...F.serif, fontSize: "clamp(22px,2.6vw,28px)", fontWeight: 500, lineHeight: 1.2, color: "var(--text)" }}>{o.title}</h3>
              <p style={{ fontSize: "14.5px", color: "var(--text-2)", lineHeight: 1.8, flex: 1 }}>{o.desc}</p>
              <div style={{ borderTop: "1px solid var(--line-faint)", paddingTop: "16px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.14em", fontStyle: "italic" }}>{o.note}</span>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--gold)", letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Enquire →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// TIMELINE — reverse chronology, alternating spine
// ─────────────────────────────────────────────────────────────
function TimelineCard({ item }) {
  const fallback = item.year === "Now" ? "✦" : item.year.replace(/[^0-9]/g, "").slice(-2);
  return (
    <div className="tl-card-inner">
      <div className="tl-head">
        <div className="tl-img">
          {item.image
            ? <img src={item.image} alt={item.title} loading="lazy" />
            : <div className="tl-img-fallback">{fallback}</div>}
        </div>
        <span className="tl-tag">{item.tag}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
    </div>
  );
}

function Timeline() {
  return (
    <section id="timeline" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: "72px", maxWidth: "640px" }}>
          <ODLabel>The Story</ODLabel>
          <SectionHeading style={{ marginBottom: "20px" }}>
            A decade of<br />
            <em style={{ color: "var(--gold)" }}>shape-shifting.</em>
          </SectionHeading>
          <p style={{ color: "var(--text-2)", fontSize: "15px", lineHeight: 1.85, marginBottom: "16px" }}>
            Most résumés are about job titles. Mine is about questions I couldn't stop asking. What follows is a reverse-chronology map — how an engineering student became the keeper of an autonomous street art district, with a few useful detours along the way.
          </p>
          <MW3BAside>Read top-down to see the present pulling forward. Read bottom-up to see how it grew.</MW3BAside>
        </div>

        {/* Spine */}
        <div className="timeline-spine">
          <div className="spine-line" />

          {TIMELINE.map((item, i) => (
            <div key={i} className={`timeline-row reveal ${i % 2 === 0 ? "" : "row-flip"}`}>
              <div className="tl-spacer" />
              <div className="tl-node">
                <span className="tl-node-year">{item.year}</span>
                <span className="tl-node-dot" />
              </div>
              <div className="tl-card">
                <TimelineCard item={item} />
              </div>
            </div>
          ))}

          {/* Origin marker */}
          <div className="tl-origin">
            <span className="tl-origin-dot" />
            <div className="tl-origin-label">Origin</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PROJECT MODAL
// ─────────────────────────────────────────────────────────────
function ProjectModal({ item, onClose }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => { const onKey = (e) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);

  const images    = item.images || [];
  const paragraphs = item.article ? item.article.split("\n\n").map((p) => p.trim()).filter(Boolean) : [];
  const blocks = [];
  const len = Math.max(paragraphs.length, images.length);
  for (let i = 0; i < len; i++) {
    if (paragraphs[i]) blocks.push({ type: "text",  value: paragraphs[i] });
    if (images[i])     blocks.push({ type: "image", value: images[i], idx: i });
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(10,10,8,0.88)", backdropFilter: "blur(10px)", overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "clamp(16px,4vw,48px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", width: "100%", maxWidth: "680px", border: "1px solid var(--line-faint)", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(248,246,241,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line-faint)", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>{item.tag}</span>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--line)", padding: "6px 14px", cursor: "pointer", ...F.mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", transition: "border-color 0.2s, color 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--text-3)"; }}>Close ✕</button>
        </div>
        <div style={{ padding: "clamp(36px,5vw,56px) clamp(28px,5vw,52px) 32px" }}>
          <h2 style={{ ...F.serif, fontSize: "clamp(30px,5vw,48px)", fontWeight: 400, lineHeight: 1.08, color: "var(--text)", marginBottom: "10px" }}>{item.title}</h2>
          <div style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.16em", marginBottom: "28px" }}>{item.stat}</div>
          <hr style={{ height: "1px", border: "none", background: "var(--line)", opacity: 0.6 }} />
        </div>
        <div style={{ paddingBottom: "clamp(48px,6vw,72px)" }}>
          {blocks.map((block, i) => {
            if (block.type === "text") {
              const isFirst = i === 0;
              return <p key={i} style={{ fontSize: isFirst ? "16px" : "14.5px", fontWeight: isFirst ? 400 : 300, lineHeight: 1.9, color: isFirst ? "var(--text)" : "var(--text-2)", padding: "0 clamp(28px,5vw,52px)", marginBottom: "0", marginTop: isFirst ? "0" : "clamp(28px,4vw,44px)" }}>{block.value}</p>;
            }
            if (block.type === "image") {
              const isInset = block.idx % 2 === 1;
              return (
                <div key={i} style={{ margin: isInset ? "clamp(28px,4vw,44px) clamp(28px,5vw,52px)" : "clamp(28px,4vw,44px) 0", background: "var(--surface-3)", overflow: "hidden", border: "1px solid var(--line-faint)" }}>
                  <img src={block.value} alt={`${item.title} — image ${block.idx + 1}`} loading="lazy" style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover", objectPosition: "center" }} />
                  <div style={{ padding: "8px 14px", borderTop: "1px solid var(--line-faint)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-4)", letterSpacing: "0.18em", flexShrink: 0 }}>{String(block.idx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
                    {item.captions?.[block.idx] && <span style={{ ...F.mono, fontSize: "11px", fontStyle: "italic", color: "var(--text-3)", letterSpacing: "0.12em", textAlign: "right" }}>{item.captions[block.idx]}</span>}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WORK
// ─────────────────────────────────────────────────────────────
function WorkCard({ item, delay, onOpen }) {
  const tilt = useTilt();
  return (
    <div {...tilt} onClick={onOpen} className={`work-card reveal reveal-d${delay}`} style={{ background: "var(--surface)", border: "1px solid var(--line-faint)", cursor: "pointer", overflow: "hidden" }}>
      <div style={{ height: "220px", background: "var(--surface-3)", position: "relative", overflow: "hidden" }}>
        {item.image ? (
          <img src={item.image} alt={item.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)" }} />
        ) : (
          <>
            <div style={{ position: "absolute", inset: 0, background: item.gradient }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "52px", opacity: 0.7 }}>{item.glyph}</div>
          </>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, rgba(15,15,13,0.35), transparent)" }} />
        <div style={{ position: "absolute", top: "12px", right: "12px", ...F.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", background: "var(--surface)", padding: "5px 10px", border: "1px solid var(--border)" }}>{item.stat}</div>
      </div>
      <div style={{ padding: "28px 26px 30px" }}>
        <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "10px" }}>{item.tag}</div>
        <h3 style={{ ...F.serif, fontSize: "23px", fontWeight: 500, lineHeight: 1.2, marginBottom: "12px", color: "var(--text)" }}>{item.title}</h3>
        <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.85 }}>{item.desc}</p>
        <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid var(--line-faint)", paddingTop: "18px", cursor: "pointer" }}>
          <span style={{ ...F.mono, fontSize: "10px", color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase" }}>View project</span>
          <span style={{ color: "var(--gold)", fontSize: "13px" }}>→</span>
        </div>
      </div>
    </div>
  );
}

function Work() {
  const [active, setActive] = useState("all");
  const [openProject, setOpenProject] = useState(null);
  const filtered = active === "all" ? WORK : WORK.filter((w) => w.cat === active);

  return (
    <>
      <section id="work" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--bg-warm)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "56px" }}>
            <ODLabel>The Work</ODLabel>
            <SectionHeading style={{ marginBottom: "12px" }}>Things I've made,<br /><em style={{ color: "var(--gold)" }}>done, and survived.</em></SectionHeading>
            <MW3BAside style={{ marginBottom: "32px", maxWidth: "380px" }}>No vague "creative solutions" here. Real projects, real briefs, real outcomes.</MW3BAside>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {WORK_FILTERS.map((f) => (
                <button key={f.id} onClick={() => setActive(f.id)} style={{ ...F.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 18px", border: "1px solid", borderColor: active === f.id ? "var(--gold)" : "var(--line-faint)", background: active === f.id ? "var(--gold)" : "transparent", color: active === f.id ? "var(--bg)" : "var(--text-3)", transition: "all 0.25s", fontFamily: "inherit" }}>{f.label}</button>
              ))}
            </div>
          </div>
          <div className="work-cols" style={{ display: "grid", gap: "2px", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {filtered.map((item, i) => <WorkCard key={item.id} item={item} delay={(i % 4) + 1} onOpen={() => setOpenProject(item)} />)}
          </div>
        </div>
      </section>
      {openProject && <ProjectModal item={openProject} onClose={() => setOpenProject(null)} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// FIELD NOTES — featured-note class added for mobile fix
// ─────────────────────────────────────────────────────────────
function FieldNotes() {
  const [featured, ...rest] = NOTES;
  return (
    <section id="writing" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>Writing</ODLabel>
          <SectionHeading style={{ marginBottom: "20px" }}>Thoughts that<br /><em style={{ color: "var(--gold)" }}>wouldn't fit in a caption.</em></SectionHeading>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginTop: "4px" }}>
            <MW3BAside style={{ maxWidth: "380px" }}>I write when something refuses to leave me alone.</MW3BAside>
            <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap", alignSelf: "center", fontStyle: "italic" }}>More writing coming soon</span>
          </div>
        </div>

        {/* Featured note — "featured-note" class enables mobile stack via CSS */}
        <div className={`reveal note-card featured-note`} style={{ border: "1px solid var(--line-faint)", background: "var(--surface)", marginBottom: "2px", cursor: "pointer", display: "grid", gridTemplateColumns: featured.image ? "1fr 380px" : "1fr", overflow: "hidden" }}>
          <div style={{ padding: "clamp(36px,5vw,60px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ ...F.mono, fontSize: "9px", color: "var(--gold)", letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid var(--border)", background: "var(--gold-faint)" }}>{featured.tag}</span>
                <span style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.12em" }}>✦ Featured</span>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-4)" }}>{featured.date}</span>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-4)" }}>{featured.read} read</span>
              </div>
            </div>
            <h3 style={{ ...F.serif, fontSize: "clamp(26px,4vw,44px)", fontWeight: 400, lineHeight: 1.15, marginBottom: "18px", color: "var(--text)", maxWidth: "680px" }}>{featured.title}</h3>
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.9, maxWidth: "600px", marginBottom: "36px" }}>{featured.excerpt}</p>
            <span style={{ ...F.mono, fontSize: "10px", color: "var(--gold)", letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: "1px solid var(--border)", paddingBottom: "2px" }}>Read the piece →</span>
          </div>
          {/* Cover image — stacks on mobile via .featured-note CSS rule */}
          {featured.image && (
            <div className="featured-note-img" style={{ position: "relative", background: "var(--surface-3)", overflow: "hidden", minHeight: "240px" }}>
              <img src={featured.image} alt={featured.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            </div>
          )}
        </div>

        <div className="notes-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
          {rest.map((note, i) => (
            <div key={note.id} className={`note-card reveal reveal-d${i + 1}`} style={{ border: "1px solid var(--line-faint)", background: "var(--surface)", cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {note.image && <div style={{ height: "160px", overflow: "hidden", flexShrink: 0, background: "var(--surface-3)" }}><img src={note.image} alt={note.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} /></div>}
              <div style={{ padding: "28px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <span style={{ ...F.mono, fontSize: "11px", color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{note.tag}</span>
                  <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-4)" }}>{note.read}</span>
                </div>
                <h4 style={{ ...F.serif, fontSize: "20px", fontWeight: 400, lineHeight: 1.3, marginBottom: "12px", color: "var(--text)" }}>{note.title}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.85, flex: 1 }}>{note.excerpt}</p>
                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--line-faint)", ...F.mono, fontSize: "12px", color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Read →</div>
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
    <section id="adventures" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--bg-warm)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>Adventures</ODLabel>
          <SectionHeading>Occasionally, I go<br /><em style={{ color: "var(--gold)" }}>completely off-script.</em></SectionHeading>
          <MW3BAside style={{ marginTop: "14px", maxWidth: "400px" }}>The Rickshaw Run was not a safe decision. It was the right one.</MW3BAside>
        </div>

        <div className="adv-cols reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid var(--line)", overflow: "hidden" }}>
          {(() => {
            const ADVENTURE_PHOTO = "images/Rikshaw Run-Gangtok to Kochi-Omkar Dhareshwar.jpg";
            return (
              <div style={{ position: "relative", minHeight: "clamp(360px,55vw,620px)", background: "var(--surface-3)", overflow: "hidden" }}>
                {ADVENTURE_PHOTO ? (
                  <>
                    <img src={ADVENTURE_PHOTO} alt="The Rickshaw Run" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(15,15,13,0.38)" }} />
                  </>
                ) : (
                  <>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 25% 55%, rgba(196,98,29,0.18), rgba(46,107,79,0.07) 50%, transparent 75%)" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1, gap: "14px" }}>
                      <div style={{ fontSize: "clamp(64px,13vw,108px)", lineHeight: 1 }}>🛺</div>
                    </div>
                  </>
                )}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: ADVENTURE_PHOTO ? 0.5 : 0.2, zIndex: 2 }} viewBox="0 0 400 500" preserveAspectRatio="none">
                  <path d="M 80 80 Q 200 120 160 200 Q 120 280 220 340 Q 300 380 280 440" stroke={ADVENTURE_PHOTO ? "#ffffff" : "var(--gold)"} strokeWidth="1.5" fill="none" strokeDasharray="6 4" />
                  <circle cx="80" cy="80" r="5" fill={ADVENTURE_PHOTO ? "#ffffff" : "var(--gold)"} />
                  <circle cx="280" cy="440" r="5" fill="var(--ember)" />
                </svg>
                <div style={{ position: "absolute", bottom: "24px", left: "24px", zIndex: 3, ...F.mono, fontSize: "11px", color: ADVENTURE_PHOTO ? "rgba(255,255,255,0.9)" : "var(--ember)", letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 12px", border: "1px solid rgba(196,98,29,0.35)", background: ADVENTURE_PHOTO ? "rgba(15,15,13,0.55)" : "var(--surface)" }}>Gangtok → Kochi · 3,000 km</div>
              </div>
            );
          })()}

          <div style={{ padding: "clamp(44px,7vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ ...F.mono, fontSize: "11px", color: "var(--ember)", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: "22px" }}>The Rickshaw Run · January 2024</div>
            <h3 style={{ ...F.serif, fontSize: "clamp(36px,5.5vw,56px)", fontWeight: 300, lineHeight: 1.02, marginBottom: "28px" }}>Gangtok to<br />Kochi.<br /><em style={{ color: "var(--gold)" }}>3,000 km.</em></h3>
            <hr className="rule" style={{ marginBottom: "26px", opacity: 0.35 }} />
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.9, marginBottom: "18px" }}>A mechanical nightmare dressed as an adventure. We took a three-wheeled rickshaw — a vehicle designed for flat city roads — across mountain passes, river crossings, and highways that showed up only on paper.</p>
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.9, marginBottom: "16px" }}>The engine died six times. We pushed it uphill twice. We ran out of diesel once and out of patience never.</p>
            <MW3BAside style={{ marginBottom: "36px" }}>Hardest thing I've done. Would do it again tomorrow.</MW3BAside>
            <div style={{ display: "flex", gap: "36px", marginBottom: "36px", flexWrap: "wrap" }}>
              {[["3,000+", "km covered"], ["14", "days on road"], ["6", "engine deaths"], ["∞", "chai stops"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ ...F.serif, fontSize: "clamp(28px,4.5vw,40px)", color: "var(--gold)", fontWeight: 400, lineHeight: 1 }}>{n}</div>
                  <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.12em", marginTop: "7px" }}>{l}</div>
                </div>
              ))}
            </div>
            <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase", fontStyle: "italic" }}>Full dispatch coming soon</span>
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
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section id="media" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)" }}>
      {activeVideo && (
        <div onClick={() => setActiveVideo(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,10,8,0.92)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "900px", aspectRatio: "16/9", position: "relative" }}>
            <iframe src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`} title="Video" allow="autoplay; encrypted-media; fullscreen" allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} />
            <button onClick={() => setActiveVideo(null)} style={{ position: "absolute", top: "-44px", right: 0, background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", ...F.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer" }}>Close ✕</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>Media</ODLabel>
          <SectionHeading>Don't take my word<br /><em style={{ color: "var(--gold)" }}>for it.</em></SectionHeading>
          <MW3BAside style={{ marginTop: "14px", maxWidth: "360px" }}>Some things only make sense when they're moving.</MW3BAside>
        </div>

        <div className="vid-cols" style={{ display: "grid", gap: "2px", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {VIDEOS.map((v, i) => (
            <div key={i} className={`vid-card reveal reveal-d${i + 1}`} style={{ cursor: "pointer" }} onClick={() => setActiveVideo(v.yt)} role="button" aria-label={`Watch: ${v.title}`}>
              <div className="vid-thumb" style={{ aspectRatio: "16/9", background: "var(--surface-3)", position: "relative", border: "1px solid var(--line-faint)", marginBottom: "14px", overflow: "hidden" }}>
                {v.thumb ? <img src={v.thumb} alt={v.title} className="vid-thumb-inner" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : <div className="vid-thumb-inner" style={{ position: "absolute", inset: 0, background: v.bg }} />}
                <div style={{ position: "absolute", inset: 0, background: "rgba(15,15,13,0.18)", transition: "background 0.3s" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                  <div className="play-btn" style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1px solid rgba(46,107,79,0.7)", background: "rgba(248,246,241,0.12)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ marginLeft: "4px", width: 0, height: 0, borderStyle: "solid", borderWidth: "9px 0 9px 15px", borderColor: "transparent transparent transparent var(--gold)" }} />
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: "10px", left: "12px", zIndex: 1, ...F.mono, fontSize: "8px", color: "rgba(248,246,241,0.7)", letterSpacing: "0.2em" }}>{String(i + 1).padStart(2, "0")} / {String(VIDEOS.length).padStart(2, "0")}</div>
              </div>
              <div style={{ ...F.serif, fontSize: "15px", fontWeight: 400, color: "var(--text)", marginBottom: "6px", lineHeight: 1.3 }}>{v.title}</div>
              <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{v.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PRESS MODAL — lightbox for articles and PDFs
// ─────────────────────────────────────────────────────────────
function PressModal({ item, onClose }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => { const onKey = (e) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(10,10,8,0.94)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,48px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: item.type === "pdf" ? "900px" : "720px", width: "100%" }}>

        {/* Top bar — publication name + close */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span style={{ ...F.serif, fontSize: "clamp(16px,2.5vw,22px)", color: "rgba(255,255,255,0.9)", fontWeight: 400 }}>{item.publication}</span>
            <span style={{ ...F.mono, fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.16em", marginLeft: "12px" }}>{item.year}</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", ...F.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer", transition: "border-color 0.2s, color 0.2s", flexShrink: 0, marginLeft: "16px" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>Close ✕</button>
        </div>

        {/* Content — image or PDF */}
        {item.type === "pdf" ? (
          <iframe src={item.src} title={item.publication} style={{ width: "100%", height: "82vh", border: "none", display: "block", background: "white" }} />
        ) : (
          <img src={item.src} alt={`${item.publication} feature`} style={{ width: "100%", maxHeight: "82vh", objectFit: "contain", display: "block" }} />
        )}

        {/* Tap to close hint */}
        <div style={{ textAlign: "center", marginTop: "14px", ...F.mono, fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Tap outside to close</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRESS CARD — reusable for featured + carousel variants
// ─────────────────────────────────────────────────────────────
function PressCard({ item, variant, onClick }) {
  const isFeatured = variant === "featured";
  return (
    <div onClick={onClick} className="press-card" style={{ position: "relative", cursor: "pointer", overflow: "hidden", flexShrink: isFeatured ? undefined : 0, width: isFeatured ? undefined : "clamp(200px,26vw,300px)", aspectRatio: isFeatured ? "4/3" : "2/3", background: "var(--surface-3)", scrollSnapAlign: "start" }}>
      <img src={item.src} alt={item.publication} className="press-img" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: isFeatured ? "linear-gradient(to top, rgba(15,15,13,0.8) 0%, rgba(15,15,13,0.15) 50%, transparent 100%)" : "linear-gradient(to top, rgba(15,15,13,0.85) 0%, transparent 55%)", pointerEvents: "none" }} />

      {/* Featured badge */}
      {isFeatured && (
        <div style={{ position: "absolute", top: "16px", left: "16px", ...F.mono, fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", border: "1px solid rgba(46,107,79,0.5)", background: "rgba(15,15,13,0.55)", padding: "5px 12px", backdropFilter: "blur(6px)" }}>✦ Featured</div>
      )}

      {/* PDF badge */}
      {item.type === "pdf" && (
        <div style={{ position: "absolute", top: isFeatured ? "16px" : "12px", right: "16px", ...F.mono, fontSize: "8px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(248,246,241,0.75)", border: "1px solid rgba(248,246,241,0.2)", background: "rgba(15,15,13,0.5)", padding: "4px 9px", backdropFilter: "blur(4px)" }}>PDF</div>
      )}

      {/* Publication name */}
      <div style={{ position: "absolute", bottom: isFeatured ? "24px" : "16px", left: isFeatured ? "24px" : "14px", right: "14px" }}>
        <div style={{ ...F.serif, fontSize: isFeatured ? "clamp(18px,2.5vw,30px)" : "15px", fontWeight: 400, color: "var(--bg)", lineHeight: 1.15, marginBottom: "5px" }}>{item.publication}</div>
        <div style={{ ...F.mono, fontSize: "9px", color: "rgba(248,246,241,0.5)", letterSpacing: "0.16em" }}>{item.year} · {isFeatured ? "Tap to view" : "View →"}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRESS SECTION — featured row + horizontal carousel
// ─────────────────────────────────────────────────────────────
function Press() {
  const [activePress, setActivePress] = useState(null);
  const featured = PRESS.filter((p) => p.featured);
  const regular  = PRESS.filter((p) => !p.featured);

  return (
    <>
      <section id="press" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--bg-warm)", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Header */}
          <div className="reveal" style={{ marginBottom: "56px" }}>
            <ODLabel>Press & Features</ODLabel>
            <SectionHeading>As seen in.</SectionHeading>
            <MW3BAside style={{ marginTop: "14px", maxWidth: "420px" }}>Apparently juggling in public is newsworthy. Twelve publications in.</MW3BAside>
          </div>

          {/* Featured — NatGeo + German Graffiti in large side-by-side cards */}
          {featured.length > 0 && (
            <div className="reveal press-featured" style={{ display: "grid", gridTemplateColumns: `repeat(${featured.length}, 1fr)`, gap: "2px", marginBottom: "2px" }}>
              {featured.map((item) => (
                <PressCard key={item.id} item={item} variant="featured" onClick={() => setActivePress(item)} />
              ))}
            </div>
          )}

          {/* Carousel — regular articles */}
          {regular.length > 0 && (
            <>
              {/* Right-side fade cue — hints at scrollability */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "80px", zIndex: 2, pointerEvents: "none", background: "linear-gradient(to left, var(--bg-warm), transparent)" }} />
                <div className="press-scroll" style={{ display: "flex", gap: "2px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "2px" }}>
                  {regular.map((item) => (
                    <PressCard key={item.id} item={item} variant="regular" onClick={() => setActivePress(item)} />
                  ))}
                </div>
              </div>

              {/* Scroll hint */}
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "10px", ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                <span>Drag to explore</span>
                <span style={{ color: "var(--gold)" }}>→</span>
              </div>
            </>
          )}
        </div>
      </section>

      {activePress && <PressModal item={activePress} onClose={() => setActivePress(null)} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <div style={{ padding: "clamp(60px,9vw,100px) clamp(20px,6vw,80px)", background: "var(--bg-warm)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "40px" }}><ODLabel>What People Say</ODLabel></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "2px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="reveal" style={{ background: "var(--surface)", border: "1px solid var(--line-faint)", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px" }}>
              <div>
                <div style={{ ...F.serif, fontSize: "48px", color: "var(--gold)", lineHeight: 0.8, marginBottom: "16px", opacity: 0.4 }}>"</div>
                <p style={{ ...F.serif, fontSize: "clamp(16px,2vw,20px)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.6, color: "var(--text)" }}>{t.quote}</p>
              </div>
              <div style={{ borderTop: "1px solid var(--line-faint)", paddingTop: "20px" }}>
                <div style={{ ...F.sans, fontSize: "13px", color: "var(--gold-light)", fontWeight: 500, marginBottom: "4px" }}>{t.name}</div>
                <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.12em" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTACT — replaces BookMe. No form. Just email + socials.
// ─────────────────────────────────────────────────────────────
function Contact() {
  const [emailHovered, setEmailHovered] = useState(false);

  return (
    <section id="book" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: "72px" }}>
          <ODLabel>Work With Me</ODLabel>
          <SectionHeading style={{ marginBottom: "16px" }}>Got something worth<br /><em style={{ color: "var(--gold)" }}>building together?</em></SectionHeading>
          <p style={{ color: "var(--text-2)", fontSize: "15px", lineHeight: 1.85, maxWidth: "560px", marginBottom: "16px" }}>Brands, agencies, curators, festival programmers — if you've made it this far, you probably already know what you want. Get in touch.</p>
          <MW3BAside>No deck required. An honest brief is worth more.</MW3BAside>
        </div>

        {/* Two columns */}
        <div className="book-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,7vw,100px)", alignItems: "start" }}>

          {/* Left — offerings */}
          <div>
            <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "24px" }}>What I offer</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {OFFERINGS.map((o) => (
                <div key={o.id} className="offer-card" style={{ background: "var(--bg-warm)", border: "1px solid var(--line-faint)", padding: "28px 26px" }}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "28px", marginTop: "2px" }}>{o.icon}</span>
                    <div>
                      <div style={{ ...F.mono, fontSize: "9px", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>{o.label}</div>
                      <div style={{ ...F.serif, fontSize: "19px", fontWeight: 500, marginBottom: "10px", color: "var(--text)" }}>{o.title}</div>
                      <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "10px" }}>{o.desc}</p>
                      <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.12em", borderTop: "1px solid var(--line-faint)", paddingTop: "10px" }}>{o.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — contact details */}
          <div className="reveal">
            <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "24px" }}>Get in touch</div>

            {/* Email — large and prominent */}
            <a
              href="mailto:omkar.dhara@gmail.com"
              style={{ display: "block", textDecoration: "none", paddingBottom: "32px", borderBottom: "1px solid var(--line-faint)", marginBottom: "32px" }}
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
            >
              <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "14px" }}>Email</div>
              <div style={{ ...F.serif, fontSize: "clamp(18px,3vw,32px)", fontWeight: 400, lineHeight: 1.25, color: emailHovered ? "var(--gold)" : "var(--text)", transition: "color 0.25s", wordBreak: "break-all" }}>
                omkar.dhara@gmail.com
              </div>
              <div style={{ ...F.mono, fontSize: "10px", color: "var(--gold)", letterSpacing: "0.14em", marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", opacity: emailHovered ? 1 : 0.7, transition: "opacity 0.25s" }}>
                Write to me <span>→</span>
              </div>
            </a>

            {/* Social links */}
            <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px" }}>Find me here</div>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-row"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: "1px solid var(--line-faint)", textDecoration: "none" }}
              >
                <span style={{ ...F.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)" }}>{s.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ ...F.mono, fontSize: "11px", color: "var(--gold)" }}>{s.handle}</span>
                  <span style={{ color: "var(--gold)", fontSize: "11px" }}>→</span>
                </div>
              </a>
            ))}

            <MW3BAside style={{ marginTop: "36px" }}>
              I read every message personally. Usually respond within 48 hours.
            </MW3BAside>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// MARQUEE STRIP
// ─────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const words = ["✦ Flow Arts", "— Performance", "✦ Activism", "— Installations", "✦ Brand Work", "— Storytelling", "✦ Workshops", "— Writing"];
  const doubled = [...words, ...words, ...words, ...words];
  return (
    <div style={{ overflow: "hidden", background: "var(--surface)", borderTop: "1px solid var(--line-faint)", borderBottom: "1px solid var(--line-faint)", padding: "13px 0" }}>
      <div className="mq" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
        {doubled.map((w, i) => (
          <span key={i} style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: i % 2 === 0 ? "var(--text-3)" : "var(--gold-dim)", padding: "0 28px" }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER — uses navHref() so "Story" routes to #timeline
// ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "clamp(44px,7vw,72px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="footer-cols" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "40px", marginBottom: "48px" }}>
          <div>
            <div style={{ ...F.serif, fontSize: "36px", fontWeight: 300, color: "var(--gold)", lineHeight: 1, marginBottom: "12px" }}>Omkar <em style={{ color: "var(--text-3)" }}>×</em> MW3B</div>
            <MW3BAside style={{ maxWidth: "280px" }}>Two names. One person. Infinite excuses to make things.</MW3BAside>
          </div>

          <div style={{ display: "flex", gap: "56px", flexWrap: "wrap" }}>
            <div>
              <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "18px" }}>Navigate</div>
              {NAV.map((l) => (
                <a key={l} href={navHref(l)} style={{ display: "block", ...F.mono, fontSize: "10px", color: "var(--text-3)", textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px", transition: "color 0.25s" }} onMouseEnter={(e) => (e.target.style.color = "var(--gold)")} onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}>{l}</a>
              ))}
            </div>
            <div>
              <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "18px" }}>Find me</div>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", ...F.mono, fontSize: "12px", color: "var(--text-3)", textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px", transition: "color 0.25s" }} onMouseEnter={(e) => (e.target.style.color = "var(--gold)")} onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}>{s.label}</a>
              ))}
            </div>
          </div>
        </div>

        <hr className="rule" style={{ marginBottom: "28px", opacity: 0.3 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-4)", letterSpacing: "0.12em" }}>© {new Date().getFullYear()} Omkar Dhareshwar aka ManWith3Balls — All rights reserved</span>
          <a href="mailto:omkar.dhara@gmail.com" style={{ ...F.mono, fontSize: "12px", color: "var(--gold)", letterSpacing: "0.14em", textDecoration: "none", transition: "color 0.25s" }} onMouseEnter={(e) => (e.target.style.color = "var(--gold-light)")} onMouseLeave={(e) => (e.target.style.color = "var(--gold)")}>omkar.dhara@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT v3.0
//   + SEO + ScrollProgress + SideRail + BackToTop
//   + New page order: Hero → CredStrip → Offerings → Work
//                    → Press → Testimonials → Timeline → Field Notes
//                    → Adventures → Media → Contact
//   + MarqueeStrip kept in code (function below) but no longer rendered
// ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(SECTIONS.map((s) => s.id));
  useSEO();

  useEffect(() => {
    const tag = document.createElement("style");
    tag.id = "od-global-css";
    tag.textContent = CSS;
    document.head.appendChild(tag);

    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.07, rootMargin: "0px 0px -32px 0px" }
    );
    const observe = () => document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
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
      <ScrollProgress />
      <Navbar scrolled={scrolled} activeSection={activeSection} />
      <SideRail activeSection={activeSection} sections={SECTIONS} />
      <main>
        <Hero />
        <CredStrip />
        <Offerings />        {/* v3.0: NEW — three-door segmenter */}
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
