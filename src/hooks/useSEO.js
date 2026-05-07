import { useEffect } from "react";
import { SOCIALS } from "../data/socials";

// ─────────────────────────────────────────────────────────────
// useSEO — sets document title, meta tags, OG, Twitter, canonical,
// and Person JSON-LD schema for the homepage.
//
// To extend for sub-pages later (e.g. /work/[slug]):
//   - Accept a `meta` arg with { title, description, image, url }
//   - Replace the hardcoded values below with arg fallbacks
//   - Replace with react-helmet-async when migrating to SSR
// ─────────────────────────────────────────────────────────────

export function useSEO() {
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
  }, []);
}
