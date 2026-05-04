/**
 * Omkar Dhareshwar × ManWith3Balls — Portfolio v2
 *
 * Design system:
 *  OD voice  → Cormorant Garamond, serif, structured, credible
 *  MW3B voice → DM Mono, raw, opinionated, slightly chaotic
 *
 * Standout interactions:
 *  1. Custom magnetic three-ball cursor (lerps, inflates on hover)
 *  2. 3D perspective tilt on work cards (per-card mouse tracking)
 *  3. Text scramble / glitch on the ManWith3Balls alias (hover)
 *
 * CHANGELOG v2.1:
 *  + Press & Features section (carousel + featured cards + lightbox)
 *  + Contact section replaces BookMe (no form — prominent email + socials)
 *  + Mobile hamburger menu redesigned (light theme, readable text)
 *  + Featured note image fixed on mobile (stacks vertically)
 *  + "Press" added to nav
 */

import { useState, useEffect, useRef, useCallback } from "react";

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
  --text: #0F0F0D;
  --text-2: #2C2C29;
  --text-3: #6B6860;
  --text-4: #A09D96;
  --text-dim: #2C2C29;
  --text-muted: #6B6860;
  --line: rgba(15,15,13,0.14);
  --line-faint: rgba(15,15,13,0.07);
  --line-strong: rgba(15,15,13,0.22);
  --border: rgba(46,107,79,0.2);
  --orange: #C4621D;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
  cursor: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
// CONTENT DATA
// ─────────────────────────────────────────────────────────────

// "Press" added to nav
const NAV = ["Work", "Writing", "Adventures", "Media", "Press", "About"];

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
    { id: "production", label: "Production" },
];

const WORK = [
  {
    id: 1,
    cat: "activism",
    tag: "Street Art · Activism · 2025",
    title: "Turning Garbage Spots into Conversation Starters",
    desc: "Using Bollywood memes as street interventions in Marol, this project explores how humor and familiarity can influence public behavior. A small artistic act aimed at making people pause, reflect, and think twice before they litter.",
    stat: "3 garbage dumping spots · 6 months",
    gradient: "radial-gradient(ellipse at 30% 40%, rgba(200,90,42,0.22), transparent 65%)",
    glyph: "🔥",
    image: "/images/Art-Activism-1.jpg",
    images: [
      "/images/Art-Activism-1- Omkar Dhareshwar.jpg",
      "/images/Art-Activism-2-Omkar Dhareshwar.jpg",
      "/images/art-activism-omkardhareshwar-3.jpg",
      "/images/art-activism-omkardhareshwar-5.jpg",
    ],
    captions: [
      "Munnabhai & Circuit advise people to dump in the bin",
      "Hera Pheri's hilarious character lamenting the situation",
      "Vijay Raaz's character from Dhamaal comes to life",
      "The installations received extensive media coverage",
    ],
    article: "Art Activism - Using Bollywood memes as street interventions in Marol to make people pause and think twice before they litter.\n\nIn a city like Mumbai, you get used to seeing the same things every day. For me, that included walking past certain spots in Marol and noticing garbage piling up in plain sight. At the bus stop on Military Road and near the Ashok Nagar bridge, trash would collect just a few feet away from bins. During the rains, it got worse. The smell, the mess, and people trying to walk around it while traffic rushed past made it hard to ignore. It stayed with me for months.\n\nI kept thinking about why this was happening. The bins were there. The system existed. But people still chose to dump waste wherever they felt like. I had seen how images of gods were sometimes used to stop people from littering, and it made me think about what holds attention today. Bollywood and memes felt like a language people instantly understand. That idea stuck with me. Instead of putting up another instruction or warning, I decided to try something people might actually notice and react to.\n\nWith help from my brother Soham Dhareshwar and support from the Dream Marol community led by Suresh Nair, I started placing framed flex boards at these dumping spots. Each one used a Bollywood-style meme to get the message across. We installed three of these over six months in areas where dumping kept happening. The idea was not complicated. If someone stopped for even a second, read it, and thought twice before throwing garbage there, it was doing its job. The project also got picked up by Mid-Day twice, which helped bring more attention to the issue.\n\nI don't know if this will completely change people's habits. But it felt important to try something instead of just walking past and feeling frustrated. If this approach works, I'll build on it. If it doesn't, I'll try something else. For me, this project was a reminder that art doesn't have to stay in a studio or gallery. It can step into everyday spaces and respond to what's happening around us.",
  },
  {
    id: 2,
    cat: "production",
    tag: "Ranveer Singh · MC Altaf · 2018",
    title: "We Shot a Cult Desi Hip-Hop Video in a Living Room and Got Ranveer Singh in It",
    desc: "How a living room shoot, borrowed resources, and a surprise Ranveer Singh cameo came together to create a small but unforgettable moment in India’s hip-hop journey.",
    stat: "300K views · Ranveer Singh· MC Altaf",
    gradient: "radial-gradient(ellipse at 40% 50%, rgba(191,155,69,0.12), transparent 65%)",
    glyph: "✊",
   image: "/images/wassup-production-omkardhareshwar-1.jpg",
    images: [
      "/images/wassup-production-2-omkardhareshwar.jpg",
      "/images/wassup-production-4-omkardhareshwar.jpg",
      "/images/wassup-production-3-omkardhareshwar.jpg",
      "/images/wassup-production-5-omkardhareshwar.jpg",
       "/images/flow-sim-5.jpg.jpeg",
    ],
    captions: [
      "With MC Altaf, D-EVIL & Bboy Flying Machine at Puma X HMGRWN Shoot",
      "MC Altaf, Udayan Dharmadhikari, Jay Kila and Omkar(clicking the pic) recording at the studio",
      "Me in the Eva's Pizza delivery uniform doing a cameo in the vidoe",
      "A still from the house party scene in the video.",
      "A collage showing where everyone is now or a nostalgic throwback group photo.",
    ],
    article: "Back in 2018, I found myself in the middle of a small but exciting circle, managing a few graffiti artists and working closely with Bboy Flying Machine, also known as Arif Chaudhary, who at the time was already a two-time Red Bull BC One India champion. Around then, a young rapper from Dharavi named MC Altaf reached out to Arif looking for guidance. Arif connected him to me, saying I might be able to help. Almost at the same time, I had met another artist, Jay Kila, who had just returned from the US. One meeting led to another, and within a week, the three of us were sitting together, talking music and realizing there was something worth building here.\n\nWe decided to record a track and reached out to my college friend Udayan Dharmadhikari from Sinhgad Institute of Technology, who had a home studio setup. The song “Wassup” came together quickly. For the video, I got another college friend, Bhumesh Das, on board. The plan was ambitious. We wanted multiple outdoor locations and a proper shoot. Then the rain showed up and refused to leave. With the forecast looking just as bad for the next day, we had to rethink everything. Within two hours, we had a new plan. My parents were heading out of town, so we turned my living room into our set.\n\nThe concept became simple and fun. Altaf would be playing Scrabble with the 7 Bantaiz crew along with Stony Psycho, also known as Tony Sebastian. That same evening, I walked into Evas Pizza in Marol and somehow managed to convince them to give us ten pizzas in exchange for a small placement in the video. Suddenly, we had food, a location, and a story. Just when things seemed sorted, Altaf mentioned he had met Ranveer Singh on the sets of Gully Boy and that he might be up for a cameo. A short while later, we had a clip of Ranveer vibing and lip-syncing to the track from his vanity van. That clip made its way into the video.\n\nThe last challenge was Jay Kila, who had already flown back to the US. We worked around it by splitting the video into parts. The daytime scenes stayed in Mumbai, and Jay filmed his portion on a green screen in the US. We added a house party sequence to tie it all together and had him appear on a TV screen within the scene. To make it feel real, we called in friends from the hip-hop community, and what followed was one of those nights where everything just clicked. The video went on to cross over 300,000 views on YouTube, which at the time felt like a big win for all of us.\n\nLooking back, what stands out is not just the video, but everything that came after. MC Altaf went on to become a key voice in the scene and joined Gully Gang, building a strong discography and audience. Udayan continued growing as a music director, Bhumesh went on to start Alphabooom and work with major artists, and 7 Bantaiz built a massive following of their own. Even Evas Pizza has grown well beyond that one Marol outlet. For me, this project is a reminder of how much can happen when you connect the right people at the right time and stay open to figuring things out as you go. It was never about having a perfect plan. It was about showing up, making things work, and enjoying the process along the way.",
 
  },
  {
    id: 3,
    cat: "installation",
    tag: "Flow · Installation · Museum of Goa · 2025",
    title: "Flow Simulator 1.0",
    desc: "An interactive juggling board built from PVC pipes, commissioned for 'Khel-Spel HomoLudens: The Art of Play, on display at Museum of Goa'.",
    stat: "108 parts · 8-week run · 2025",
    gradient: "radial-gradient(ellipse at 50% 60%, rgba(100,80,200,0.14), transparent 65%)",
    glyph: "🎨",
    image: "/images/flow-sim-2.jpg.png",
    images: [
      "/images/flow-sim-1.jpg.jpeg",
      "/images/flow-sim-2.jpg.png",
      "/images/flow-sim-4.jpg.png",
      "/images/flow-sim-3.jpg.jpeg",
    ],
    captions: [
      "Flow Simulator 1.0 Displayed at Museum of Goa",
      "The installation was part of Homo Ludens- Khel-Spel Exhibition",
      "Visitors enjoyed the simulated juggling experience",
      "The display was accompanied by a flow workshop including balls, dapo star and poi",
    ],
    article: "The Flow Simulator 1.0 is an interactive installation commissioned for 'Khel-Spel HomoLudens: The Art of Play' at the Museum of Goa, Pilerne.\n\nThe Museum of Goa has built a reputation as a space where art feels alive and participatory, and the exhibition Homo Ludens: The Art of Play reflects that spirit. Inspired by Johan Huizinga's idea that play is central to culture, the exhibition brings together artists from India and the Netherlands to explore how play shapes the way we think, create, and connect. With a wide range of works on display, the show invites visitors to engage directly, encouraging curiosity and interaction rather than passive viewing.\n\nWithin this setting, I had the opportunity to present my interactive installation, Flow Simulator 1.0, as part of the 'Khel-Spel Homo Ludens' showcase curated by Sajid Wajid Shaikh. The piece draws from Craig Quat's juggling board and combines elements of juggling and functional movement. Built using PVC pipes, the work reflects ideas like Jugaad and Zuinig, where simple materials are used thoughtfully to create something meaningful. The structure guides movement in specific pathways, while still allowing for variation in rhythm and coordination, giving each participant their own way of engaging with it.\n\nThe installation works as both an art piece and a hands-on experience. Participants use it to move multiple balls through the system, which naturally brings focus to their movement and timing. As they continue, the repetition and rhythm begin to settle the mind, creating a sense of calm and concentration. This experience connects to the idea of a flow state, where attention becomes steady and the body and mind feel in sync. Through this process, people improve coordination and awareness while also finding a quiet, meditative rhythm.\n\nOne of the most memorable parts of the exhibition was leading a juggling workshop for children. Seeing a group of 10-year-olds learn and successfully perform a three-ball cascade was incredibly rewarding. Their excitement and focus captured what the exhibition was really about. Presenting the work, performing at the opening, and interacting with such an engaged audience felt like a natural extension of my practice. With support from Sharada Kerkar and the larger creative community, the experience reaffirmed my belief that play can open up new ways of learning, moving, and understanding ourselves.",
  },
  {
    id: 4,
    cat: "activism",
    tag: "Marol Art Village · Art District · Street Art ",
    title: "Putting Marol on the Global Street Art Map",
    desc: "How a dream to give Marol its own identity evolved into a full blown Street Art District",
    stat: "500+ murals · 2000+ volunteers · Zero Funding",
    gradient: "radial-gradient(ellipse at 40% 50%, rgba(191,155,69,0.12), transparent 65%)",
    glyph: "✊",
   image: "/images/marol-art-cover-1.jpg",
    images: [
      "/images/marol-art-village-2.jpg",
      "/images/marol-art-village-3.jpg",
      "/images/marol-art-village-4.jpg",
      "/images/flow-sim-3.jpg.jpeg",
    ],
    captions: [
      "Piece by South African artist, Jestr at Ecopark,2017",
      "Spidey character by Mooz at the Wall of Fame,2017",
      "Portrait by Brazilian artist, Valdi Valdi at Ecopark,2015",
      "The display was accompanied by a flow workshop including balls, dapo star and poi",
    ],
    article: "For years, whenever someone asked where I lived, I said 'near Powai' or 'close to the airport'. Saying 'Marol' meant a follow-up question I'd have to answer anyway. As someone who grew up here, that always sat uncomfortably with me.\n\nMarol had character, history, people from every background imaginable. What it didn't have was a face. Around 2015, I started looking at walls.The first thing I noticed was that the painting was only part of what was happening. People who would normally never speak to each other were suddenly standing side by side, discussing colours, holding ladders, sharing chai. Residents who had lived near each other for years with no reason to talk suddenly had one. Once I saw that, the project became something much larger than graffiti.\n\nThrough Wicked Broz and later Marol Art Village, I started building the infrastructure around those moments. Pitching concepts, getting permissions, sourcing paint, finding storage, coordinating artists, convincing housing societies that this idea could actually work. There was no funding and no sponsor. Just the slow accumulation of trust, one wall at a time. Every mural made the next conversation a little easier.\n\nThe clearest proof of this came when artists from Brazil's Keep It Real Crew painted the clubhouse at Eco Park. Families came downstairs. People called friends over. Photographs were taken. What was supposed to be a painting session turned into an afternoon nobody planned for. The clubhouse got repainted two months later and that never bothered me. The afternoon had already happened, and it showed me that a painting changes how a place feels even after the painting is gone.\n\nThe Ladies First Festival in 2019 was a different kind of turning point. The Military Road Residents Welfare Association helped secure permissions and organise at a scale we hadn't reached before. That was the moment it stopped feeling like something we were sneaking past the city and started feeling like something the city was joining.\n\nToday I visit our hotspots and find murals I had nothing to do with. Indian and international artists arrive on their own, paint, and leave something behind. Jams get organised between people who found each other through the walls. There are over 500 murals across Marol now, all without a single rupee of external funding.\n\nIn the beginning I had to be present for everything, follow up on every wall, convince every person individually. Then at some point I wasn't needed for all of it anymore. What I had planted had grown roots I hadn't put there myself. That is the part that stays with me more than the number of murals.",
  },
  {
    id: 5,
    cat: "performance",
    tag: "Keynote Performance · Bangalore · 2023",
    title: "Navigating Chaos",
    desc: "A 45-minute corporate keynote for a 500-person audience — half live performance, half honest talk about creative decision-making. Not the kind of keynote anyone expected. Exactly why it worked.",
    stat: "500 attendees",
    gradient: "radial-gradient(ellipse at 55% 30%, rgba(200,90,42,0.16), transparent 65%)",
    glyph: "⚡",
  },
  {
    id: 6,
    cat: "installation",
    tag: "Group Show · Laxmi Projects, Mumbai",
    title: "Tactile Light",
    desc: "A four-artist collaborative installation exploring edges of perception. My contribution: a kinetic light rig that responds to breath. Shown for three weeks. Sold out on opening night.",
    stat: "4 artists",
    gradient: "radial-gradient(ellipse at 70% 55%, rgba(100,180,200,0.13), transparent 65%)",
    glyph: "💡",
  },
];

const NOTES = [
  {
    id: 1,
    image: "/images/flow-artist-omkardhareshwar-1.jpg",
    title: "What flow arts actually taught me about being still",
    date: "March 2025",
    read: "5 min",
    tag: "Craft",
    excerpt: "The cruel paradox at the center of every movement practice: the harder you chase the state, the further it gets. Here's what six years of throwing objects at my own face taught me about letting go.",
  },
  {
    id: 2,
    image: "/images/Rikshaw Run- Gangtok to Kochi- Omkar Dhareshwar- Finish Line.jpg",
    title: "Gangtok to Kochi in a Rickshaw. Notes from the road.",
    date: "January 2025",
    read: "12 min",
    tag: "Adventure",
    excerpt: "3,000 km on three wheels with no plan, one co-driver, and a vehicle that kept threatening to retire. A dispatch from the Rickshaw Run.",
  },
  {
    id: 3,
    image: "/images/red-bull-bc-one-cypher-india-2024-winner-flying-machine.jpg",
    title: "Writing for Red Bull: what it means to translate something wordless",
    date: "November 2024",
    read: "7 min",
    tag: "Writing",
    excerpt: "When a mainstream brand wants to cover a subculture, something usually gets lost in translation. On trying to not be that loss.",
  },
  {
    id: 4,
    title: "Why I stopped explaining what I do at parties",
    date: "September 2024",
    read: "4 min",
    tag: "Identity",
    excerpt: "\"So what do you do?\" I used to give a different answer every time. Lately I've stopped answering at all. It's going better.",
  },
];

const VIDEOS = [
  { title: "Britannia Chocostars", sub: "TV Commercial shot for Britannia", yt: "jyzFUHqmjsQ", thumb: "https://img.youtube.com/vi/jyzFUHqmjsQ/maxresdefault.jpg", bg: "radial-gradient(ellipse at 30% 50%, rgba(200,90,42,0.25), transparent)" },
  { title: "Wicked Broz X Mochi-4 City Tour", sub: "Bengaluru·Hyderabad·Chennai·Goa·Hiphop Vlog", yt: "-EecfvR0_FE", thumb: "https://img.youtube.com/vi/-EecfvR0_FE/maxresdefault.jpg", bg: "radial-gradient(ellipse at 60% 40%, rgba(191,155,69,0.2), transparent)" },
  { title: "Doordarshan-Beyond Thoughts", sub: "Join me as I walk through my journey on National Television", yt: "5A9IgNfa7Wg", thumb: "/images/Doordarshan-Beyond Thoughts- Omkar Dhareshwar.png", bg: "radial-gradient(ellipse at 45% 55%, rgba(100,80,200,0.2), transparent)" },
  { title: "Museum of Goa — Flow Simulator", sub: "Modified Juggling Board displayed at MOG as part of the exhibition 'Khel-Spel HomoLudens: The Art of Play'", yt: "6psNfvXNDkM", portrait: true, thumb: "https://img.youtube.com/vi/6psNfvXNDkM/maxresdefault.jpg", bg: "radial-gradient(ellipse at 45% 55%, rgba(100,80,200,0.2), transparent)" },
  { title: "Vithoba Dantmanjan X Shruti Haasan", sub: "Commercial for Vithoba Dantmanjan, featuring Shruti Haasan", yt: "pYxmfvJM9So", portrait: true, thumb: "https://img.youtube.com/vi/pYxmfvJM9So/maxresdefault.jpg", bg: "radial-gradient(ellipse at 45% 55%, rgba(100,80,200,0.2), transparent)" },
  { title: "Blindfold Juggling", sub: "Blind World. A social juggling commentary", yt: "zogO_4McBPg", portrait: true, thumb: "https://img.youtube.com/vi/zogO_4McBPg/maxresdefault.jpg", bg: "radial-gradient(ellipse at 45% 55%, rgba(100,80,200,0.2), transparent)" },
];

const OFFERINGS = [
  { id: "perf", icon: "🎭", label: "Performances", title: "Live Fire & Flow", desc: "Solo sets or collaborative shows. Fire, poi, staff, silk — or a combination that doesn't have a name yet. For festivals, corporate events, brand activations, and private occasions.", note: "Indoor / outdoor / rain-proof" },
  { id: "workshop", icon: "🌀", label: "Workshops", title: "Flow State for Humans", desc: "A workshop that teaches the principles of flow through movement — not PowerPoint. Built for corporate teams, creative organisations, and groups who want something that actually works.", note: "Half-day or full-day formats" },
  { id: "brand", icon: "✦", label: "Brand Collaborations", title: "Creative Direction + Content", desc: "Art direction, long-form writing, content creation, brand storytelling — for brands that want something to mean something. Not PR. Not content marketing. Work.", note: "Red Bull, Museum of Goa, and others on request" },
];

const TESTIMONIALS = [
  { quote: "Omkar doesn't just perform — he changes the room. The keynote was the thing people talked about for months.", name: "Priya Mehta", role: "Head of Culture, Design Studio, Bangalore" },
  { quote: "Working with him on the Red Bull series was the easiest it's ever been to get something true out of a subculture story.", name: "Sid Rao", role: "Commissioning Editor, Red Bull India" },
];

// ─────────────────────────────────────────────────────────────
// PRESS DATA
// ─────────────────────────────────────────────────────────────
// featured: true  → shown in the large top row (NatGeo, German Graffiti)
// featured: false → scrollable carousel below
// type: "image"   → opens image in lightbox
// type: "pdf"     → opens PDF in inline iframe lightbox
//
// TO ADD A NEW ARTICLE:
//   { id: X, publication: "Name", featured: false, type: "image", src: "/images/press/yourfile.jpg", year: "2024" }
// ─────────────────────────────────────────────────────────────
const PRESS = [
  {
    id: 1,
    publication: "National Geographic",
    featured: true,
    type: "image",
    src: "/images/press/natgeo.jpg",       // ← add your image here
    year: "2024",
  },
  {
    id: 2,
    publication: "Graffiti Magazine (DE)",
    featured: true,
    type: "image",
    src: "/images/press/german-graffiti.jpg", // ← add your image here
    year: "2023",
  },
  {
    id: 3,
    publication: "Mid-Day",
    featured: false,
    type: "image",
    src: "/images/press/midday-1.jpg",
    year: "2025",
  },
  {
    id: 4,
    publication: "Mid-Day",
    featured: false,
    type: "image",
    src: "/images/press/midday-2.jpg",
    year: "2024",
  },
  {
    id: 5,
    publication: "Publication Name",
    featured: false,
    type: "image",                          // change to "pdf" for PDF files
    src: "/images/press/article-5.jpg",
    year: "2023",
  },
  {
    id: 6,
    publication: "Publication Name",
    featured: false,
    type: "image",
    src: "/images/press/article-6.jpg",
    year: "2023",
  },
  {
    id: 7,
    publication: "Publication Name",
    featured: false,
    type: "image",
    src: "/images/press/article-7.jpg",
    year: "2022",
  },
  {
    id: 8,
    publication: "Publication Name",
    featured: false,
    type: "image",
    src: "/images/press/article-8.jpg",
    year: "2022",
  },
  // ← Duplicate a block above to add more articles
];

// ─────────────────────────────────────────────────────────────
// SOCIALS DATA — update handles and links here
// ─────────────────────────────────────────────────────────────
const SOCIALS = [
  { label: "Instagram", handle: "@omkar_dhara",    href: "https://instagram.com/omkar_dhara"      },
  { label: "YouTube",   handle: "@OmkarDhareshwar",     href: "https://www.youtube.com/@OmkarDhareshwar"       },
  { label: "LinkedIn",  handle: "OmkarDhareshwar",  href: "https://www.linkedin.com/in/omkardhareshwar" },
  { label: "Juggler Insta",  handle: "@manwith3balls",       href: "https://instagram.com/manwith3balls" },                    
];

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
    const lerp = (a, b, t) => a + (b - a) * t;
    const onMove = (e) => { posRef.current = { x: e.clientX, y: e.clientY }; };
    const SELECTOR = "a, button, .work-card, .note-card, .offer-card, .vid-card, .cred-tag, .press-card";
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
// NAVBAR — mobile menu changed from dark to cream
// ─────────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, height: "62px", padding: "0 clamp(20px,5vw,56px)", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(248,246,241,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none", borderBottom: scrolled ? "1px solid var(--line-faint)" : "none", transition: "all 0.6s ease" }}>
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ ...F.serif, fontSize: "20px", fontWeight: 500, color: "var(--gold)", letterSpacing: "0.05em" }}>Omkar</span>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.08em" }}>×</span>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.1em" }}>MW3B</span>
        </a>

        <div className="d-nav" style={{ display: "flex", alignItems: "center", gap: "38px" }}>
          {NAV.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-item" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", textDecoration: "none", transition: "color 0.25s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}>{l}</a>
          ))}
          <a href="#book" className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "9px 22px", fontWeight: 400 }}>Let's work</a>
        </div>

        <button className="ham" onClick={() => setOpen((o) => !o)} style={{ display: "none", flexDirection: "column", gap: "5px", background: "none", border: "none", padding: "6px" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: "block", width: "20px", height: "1px", background: "var(--text-3)", transform: open ? i === 0 ? "rotate(45deg) translate(4px,5.5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5.5px)" : "scaleX(0)" : "none", transition: "all 0.28s" }} />
          ))}
        </button>
      </nav>

      {/* ── Mobile menu — light cream theme ── */}
      {open && (
        <div className="mob-menu" style={{ position: "fixed", top: "62px", left: 0, right: 0, zIndex: 499, background: "rgba(248,246,241,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--line)", padding: "36px clamp(20px,5vw,56px)", display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} style={{ ...F.mono, fontSize: "13px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid var(--line-faint)", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}>{l}</a>
          ))}
          <a href="#book" onClick={() => setOpen(false)} className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "13px 28px", display: "inline-block", alignSelf: "flex-start", marginTop: "20px" }}>Let's work together</a>
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
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px clamp(20px,6vw,80px) 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div className="orb-a" style={{ position: "absolute", top: "8%", right: "5%", width: "clamp(240px,38vw,560px)", height: "clamp(240px,38vw,560px)", borderRadius: "50%", background: "radial-gradient(circle at 36% 36%, rgba(46,107,79,0.1), rgba(46,107,79,0.03) 50%, transparent 72%)", border: "1px solid rgba(46,107,79,0.07)" }} />
        <div className="orb-b" style={{ position: "absolute", top: "55%", right: "16%", width: "clamp(120px,18vw,260px)", height: "clamp(120px,18vw,260px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,98,29,0.09), transparent 70%)", border: "1px solid rgba(196,98,29,0.06)" }} />
        <div className="orb-c" style={{ position: "absolute", top: "28%", right: "2%", width: "clamp(56px,7vw,96px)", height: "clamp(56px,7vw,96px)", borderRadius: "50%", background: "rgba(46,107,79,0.05)", border: "1px solid rgba(46,107,79,0.12)" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(46,107,79,0.06) 30%, rgba(46,107,79,0.06) 70%, transparent)" }} />
      </div>

      <div style={{ position: "relative", maxWidth: "1000px" }}>
        <div className="h-1" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
          <span style={{ ...F.serif, fontSize: "13px", fontWeight: 500, color: "var(--gold)", letterSpacing: "0.06em" }}>Omkar Dhareshwar</span>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-4)", letterSpacing: "0.1em" }}>×</span>
          <span className="glitch-wrap" data-text={display} onMouseEnter={scramble} style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ember)", paddingBottom: "2px", borderBottom: "1px solid var(--ember)", opacity: 0.85 }}>{display}</span>
        </div>

        <h1 className="h-2" style={{ ...F.serif, fontSize: "clamp(64px, 13.5vw, 168px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.025em", marginBottom: "36px" }}>
          Omkar<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Dhareshwar.</em>
        </h1>

        <div className="h-3" style={{ marginBottom: "56px" }}>
          <p style={{ ...F.mono, fontSize: "clamp(10px,1.4vw,12px)", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "8px" }}>Artist · Activist · Storyteller · Perpetual Work-in-Progress</p>
          <MW3BAside style={{ marginTop: "10px", maxWidth: "420px" }}>Mechanical engineer by degree. Everything else by choice. Turns out the best use of an engineering brain is knowing which rules to break.</MW3BAside>
        </div>

        <div className="h-4" style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <a href="#work" className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "15px 40px", display: "inline-block" }}>See what I do</a>
          <a href="#book" className="btn-ghost"    style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "15px 40px", display: "inline-block" }}>Get in touch</a>
        </div>
      </div>

      <div className="drip h-5" style={{ position: "absolute", bottom: "44px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <span style={{ ...F.mono, fontSize: "8px", color: "var(--text-4)", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, var(--gold-dim), transparent)" }} />
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
    <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line-faint)", borderBottom: "1px solid var(--line-faint)", overflow: "hidden", padding: "16px 0" }}>
      <div style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.18em", color: "var(--text-4)", textTransform: "uppercase", textAlign: "center", marginBottom: "12px" }}>Work that's been trusted by</div>
      <div style={{ overflow: "hidden" }}>
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
// ABOUT
// ─────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="about-cols reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(48px,9vw,120px)", alignItems: "start" }}>

          <div>
            <ODLabel>About Omkar</ODLabel>
            <SectionHeading style={{ marginBottom: "28px" }}>I live and work<br /><em style={{ color: "var(--gold)" }}>at the edges.</em></SectionHeading>
            <hr className="rule" style={{ margin: "28px 0", opacity: 0.5 }} />
            <p style={{ color: "var(--text-2)", lineHeight: 1.9, fontSize: "15px", marginBottom: "18px" }}>
              I'm a flow artist, live performer, writer, and activist. I've performed for audiences of five and audiences of five hundred. I've created installations in formal gallery spaces and unannounced performances in train stations.
            </p>
            <p style={{ color: "var(--text-2)", lineHeight: 1.9, fontSize: "15px", marginBottom: "18px" }}>
              My brand work includes commissioned longform for{" "}
              <a href="https://www.redbull.com/in-en" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-light)", fontWeight: 400, textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Red Bull India</a>
              , a site-specific installation for the{" "}
              <a href="https://museumofgoa.com/program/homo-ludens-the-art-of-play/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-light)", fontWeight: 400, textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Museum of Goa</a>
              , and corporate workshops for teams who want something that actually changes the room.
            </p>
            <p style={{ color: "var(--text-2)", lineHeight: 1.9, fontSize: "15px" }}>
              I operate under the name <strong style={{ color: "var(--gold-light)", fontWeight: 400 }}>ManWith3Balls</strong> — a creative identity built to hold the experimental, the playful, and the parts of the work that resist easy categorisation.
            </p>
            <blockquote style={{ margin: "40px 0 0", padding: "20px 0 0 22px", borderLeft: "2px solid var(--gold)" }}>
              <p style={{ ...F.serif, fontSize: "clamp(20px,2.8vw,28px)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.35, color: "var(--text)" }}>"Movement is how I think.<br />Performance is how I speak."</p>
            </blockquote>
          </div>

          <div>
            {(() => {
              const ABOUT_PHOTO = "/images/Omkar Dhareshwar-About.jpeg";
              const ABOUT_CAPTION = "Omkar in Marol Art Village 2020";
              return (
                <div style={{ width: "100%", aspectRatio: "3/4", background: ABOUT_PHOTO ? "var(--surface-3)" : "linear-gradient(160deg, var(--surface-3) 0%, var(--surface) 60%, rgba(46,107,79,0.05) 100%)", border: "1px solid var(--line)", position: "relative", overflow: "hidden", marginBottom: "32px" }}>
                  {ABOUT_PHOTO && <img src={ABOUT_PHOTO} alt={ABOUT_CAPTION} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />}
                  {[{ top: "14px", left: "14px" }, { top: "14px", right: "14px" }, { bottom: "14px", left: "14px" }, { bottom: "14px", right: "14px" }].map((pos, i) => (
                    <div key={i} style={{ position: "absolute", width: "18px", height: "18px", borderTop: i < 2 ? "1px solid var(--gold)" : undefined, borderBottom: i >= 2 ? "1px solid var(--gold)" : undefined, borderLeft: i % 2 === 0 ? "1px solid var(--gold)" : undefined, borderRight: i % 2 === 1 ? "1px solid var(--gold)" : undefined, zIndex: 2, opacity: ABOUT_PHOTO ? 0.7 : 1, ...pos }} />
                  ))}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, padding: "10px 14px", background: ABOUT_PHOTO ? "rgba(15,15,13,0.5)" : "transparent", display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ ...F.mono, fontSize: "12px", color: ABOUT_PHOTO ? "rgba(255,255,255,0.7)" : "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{ABOUT_CAPTION}</span>
                  </div>
                </div>
              );
            })()}
            <MW3BAside style={{ marginBottom: "28px" }}>People ask me what I do. I give a different answer every time. Not because I'm being evasive — because the work keeps changing. That's the point.</MW3BAside>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--line-faint)" }}>
              {[["5+", "years active"], ["500+", "live audience"], ["12+", "brand projects"], ["3", "gallery shows"]].map(([n, l]) => (
                <div key={l} style={{ background: "var(--bg)", padding: "20px 18px" }}>
                  <div style={{ ...F.serif, fontSize: "30px", color: "var(--gold)", fontWeight: 400, lineHeight: 1 }}>{n}</div>
                  <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.14em", marginTop: "6px" }}>{l}</div>
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
            <a href="#" style={{ ...F.mono, fontSize: "10px", color: "var(--gold)", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap", alignSelf: "center", borderBottom: "1px solid var(--border)", paddingBottom: "2px", transition: "opacity 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>All field notes &#8594;</a>
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
            <a href="#" style={{ ...F.mono, fontSize: "10px", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>Read the full dispatch →</a>
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
// FOOTER — Press added to nav links
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
                <a key={l} href={`#${l.toLowerCase()}`} style={{ display: "block", ...F.mono, fontSize: "10px", color: "var(--text-3)", textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px", transition: "color 0.25s" }} onMouseEnter={(e) => (e.target.style.color = "var(--gold)")} onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}>{l}</a>
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
// ROOT — Press section added between Media and Testimonials
// ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);

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
      <Navbar scrolled={scrolled} />
      <Hero />
      <CredStrip />
      <About />
      <MarqueeStrip />
      <Work />
      <FieldNotes />
      <Adventures />
      <Media />
      <Press />          {/* ← NEW: Press & Features section */}
      <Testimonials />
      <Contact />        {/* ← UPDATED: Replaces BookMe — no form */}
      <Footer />
    </>
  );
}
