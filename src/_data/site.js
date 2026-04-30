/** Global site data — edit this file to update NAP, hours, schema, tracking IDs */
module.exports = {
  // ── Business identity ──────────────────────────────────────────────────────
  name:        "Queensway Heating & Air Conditioning",
  nameDBA:     "QueenswayAir",
  legalName:   "Queensway Heating & Air Conditioning",
  tagline:     "GTA's Trusted Heating & Cooling Experts",
  description: "Queensway Heating & Air Conditioning provides expert furnace, AC, heat pump, ductless AC, water heater, fireplace, and HRV installation and repair across the Greater Toronto Area.",
  url:         "https://www.queenswayair.ca",

  // ── Contact ────────────────────────────────────────────────────────────────
  phone:       "(647) 928-5636",
  phonePlain:  "6479285636",
  smsPhone:    "(647) 928-5636",
  email:       "queenswayair@gmail.com",
  quoteUrl:    "/quote/",

  // ── Address (primary office) ───────────────────────────────────────────────
  address: {
    street:   "123 Queensway Blvd",      // ← REPLACE
    city:     "Mississauga",
    province: "ON",
    postal:   "L5B 2X9",                 // ← REPLACE
    country:  "CA",
    mapUrl:   "https://maps.google.com/?q=Queensway+Heating+and+Cooling+Mississauga", // ← REPLACE
  },

  // Geo coordinates for schema.org
  geo: {
    lat: 43.5890,   // ← REPLACE
    lng: -79.6441,  // ← REPLACE
  },

  // ── Business hours ─────────────────────────────────────────────────────────
  hours: "Monday–Friday: 8am–6pm · Saturday: 9am–4pm · Sunday: Emergency Only",
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], open: "08:00", close: "18:00" },
    { days: ["Saturday"], open: "09:00", close: "16:00" },
  ],
  emergencyService: true,

  // ── License / credentials ──────────────────────────────────────────────────
  tssaLicense:    "TSSA-XXXXXXXXX",      // ← REPLACE
  yearsInBusiness: 15,                   // ← REPLACE
  priceRange:     "$$",

  // ── Social / review links ──────────────────────────────────────────────────
  social: {
    facebook:  "https://facebook.com/queenswayair",    // ← REPLACE or remove
    instagram: "https://instagram.com/queenswayair",   // ← REPLACE or remove
    linkedin:  "",
  },
  gbpUrl:       "https://g.page/r/queenswayair",       // ← REPLACE (Google Business Profile URL)
  homestarsUrl: "https://www.homestars.com/companies/queenswayair", // ← REPLACE
  reviewCount:  "450+",                                // ← REPLACE with real count
  reviewRating: 4.9,                                   // ← REPLACE

  // ── Tracking (leave blank until ready — no empty script tags emitted) ──────
  gtmId:       "",   // e.g. "GTM-XXXXXXX"
  metaPixelId: "",   // e.g. "1234567890"

  // ── Default SEO meta (overridden per-page via front matter) ───────────────
  defaultTitle:       "Queensway Heating and Cooling | HVAC Repair & Installation in Mississauga",
  defaultDescription: "Expert furnace, AC, and heat pump services in Mississauga and the GTA. 24/7 emergency service. Call Queensway Heating and Cooling today.",
  ogImage:            "/assets/img/og/og-home.jpg",   // 1200×630

  // ── Manufacturer / certification logos (rendered in footer) ───────────────
  certs: [
    // { name: "Trane Comfort Specialist", logo: "/assets/img/certs/trane.png" },
    // { name: "Lennox Premier Dealer",    logo: "/assets/img/certs/lennox.png" },
    // { name: "TSSA Registered",          logo: "/assets/img/certs/tssa.png"   },
    // { name: "HomeStars Best of Award",  logo: "/assets/img/certs/homestars.png" },
  ],
};
