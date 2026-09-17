/** Global site data — edit this file to update NAP, hours, schema, tracking IDs */
module.exports = {
  // ── Business identity ──────────────────────────────────────────────────────
  name:        "Queensway Heating & Air Conditioning",
  nameDBA:     "QueenswayAir",
  legalName:   "Queensway Heating & Air Conditioning",
  tagline:     "GTA's Trusted Heating & Cooling Experts",
  description: "Queensway Heating & Air Conditioning provides expert furnace, AC, heat pump, ductless AC, water heater, fireplace, and HRV installation and repair across the Greater Toronto Area, Hamilton, and Niagara.",
  url:         "https://www.queenswayair.ca",

  // ── Contact ────────────────────────────────────────────────────────────────
  phone:       "(647) 928-5636",
  phonePlain:  "6479285636",
  smsPhone:    "(647) 928-5636",
  email:       "queenswayair@gmail.com",
  quoteUrl:    "/quote/",

  // ── Address (mobile service — no public office address) ────────────────────
  address: {
    street:   "",
    city:     "Mississauga",
    province: "ON",
    postal:   "",
    country:  "CA",
    mapUrl:   "https://maps.google.com/?q=Queensway+Heating+and+Cooling+Mississauga",
  },

  // Geo coordinates for schema.org
  geo: {
    lat: 43.5890,   // ← REPLACE
    lng: -79.6441,  // ← REPLACE
  },

  // ── Business hours ─────────────────────────────────────────────────────────
  hours: "Open 24 hours — 7 days a week",
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], open: "00:00", close: "23:59" },
  ],
  emergencyService: true,

  // ── License / credentials ──────────────────────────────────────────────────
  tssaLicense:    "",                    // ← set once you have a license number to display
  yearsInBusiness: 15,                   // ← REPLACE
  founded:        2011,
  priceRange:     "$$",

  // ── Social / review links ──────────────────────────────────────────────────
  social: {
    facebook:  "https://facebook.com/queenswayair",    // ← REPLACE or remove
    instagram: "https://instagram.com/queenswayair",   // ← REPLACE or remove
    linkedin:  "",
  },
  gbpUrl:       "https://share.google/muPnk7Xrb53dTe8pj", // Google Business Profile reviews link
  reviewCount:  "5",
  reviewRating: 5,

  // ── Tracking (leave blank until ready — no empty script tags emitted) ──────
  gtmId:       "GTM-MWQFW5G5",
  metaPixelId: "",   // e.g. "1234567890"

  // ── Default SEO meta (overridden per-page via front matter) ───────────────
  defaultTitle:       "Queensway Heating and Cooling | HVAC Repair & Installation in Mississauga",
  defaultDescription: "Expert furnace, AC, and heat pump services in Mississauga, the GTA, Hamilton, and Niagara. 24/7 emergency service. Call Queensway Heating and Cooling today.",
  ogImage:            "/assets/img/og/og-home.jpg",   // 1200×630

  // ── Manufacturer / certification logos (rendered in footer) ───────────────
  certs: [
    // { name: "Trane Comfort Specialist", logo: "/assets/img/certs/trane.png" },
    // { name: "Lennox Premier Dealer",    logo: "/assets/img/certs/lennox.png" },
    // { name: "TSSA Registered",          logo: "/assets/img/certs/tssa.png"   },
    // { name: "HomeStars Best of Award",  logo: "/assets/img/certs/homestars.png" },
  ],
};
