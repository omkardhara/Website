// ─────────────────────────────────────────────────────────────
// PRESS DATA
// featured: true  → shown in the large top row (NatGeo, German Graffiti)
// featured: false → scrollable carousel below
// type: "image"   → opens image in lightbox
// type: "pdf"     → opens PDF in inline iframe lightbox
//
// TO ADD A NEW ARTICLE:
//   { id: X, publication: "Name", featured: false, type: "image", src: "/images/press/yourfile.jpg", year: "2024" }
// ─────────────────────────────────────────────────────────────

export const PRESS = [
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
