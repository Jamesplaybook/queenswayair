#!/usr/bin/env node
/**
 * Generate placeholder photography for QueenswayAir via OpenAI's image API.
 *
 * Usage:
 *   $env:OPENAI_API_KEY="sk-..."          # PowerShell
 *   npm run generate:images                # generate missing slots only
 *   npm run generate:images -- --force     # regenerate every slot
 *   npm run generate:images -- hero faq    # generate specific slots
 *
 * Default model is gpt-image-2 (highest quality, may require OpenAI org verification).
 * Fallbacks: OPENAI_IMAGE_MODEL=gpt-image-1 or OPENAI_IMAGE_MODEL=dall-e-3.
 *
 * After generation, run `npm run build` — eleventy-img picks up the new
 * sources and produces AVIF/WebP/JPEG variants automatically.
 */

const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
const ROOT = path.resolve(__dirname, "..");

const jobs = [
  {
    slot: "hero",
    out: "src/assets/img/hero/hero-home.jpg",
    size: "1536x1024",
    prompt:
      "Bright commercial editorial outdoor product photograph for an HVAC company homepage hero. " +
      "Setting: a sun-drenched open landscape on a perfect day. Lower third of frame: lush, " +
      "vibrant, freshly-mown emerald-green grass with subtle texture, stretching gently to a " +
      "soft horizon. Upper two thirds: brilliant cerulean blue sky with soft volumetric sun rays " +
      "beaming diagonally from the upper-left corner, a few wispy white cumulus clouds, light " +
      "atmospheric haze near the horizon. Mood: optimistic, cheerful, fresh outdoor air, " +
      "premium, healthy living, breathable. " +
      "Centred in the lower-middle of the frame as a curated outdoor product showcase: five " +
      "modern residential HVAC products grouped together with natural staggered depth and varied " +
      "heights — visually balanced cluster, like a magazine product hero shot, NOT a rigid " +
      "straight lineup. Products: (1) tall white high-efficiency gas furnace with neat exhaust " +
      "pipes; (2) compact wall-hung tankless water heater; (3) wall-mounted ductless mini-split " +
      "indoor head; (4) boxy outdoor air-conditioner condenser with top fan grille; (5) modern " +
      "outdoor air-source heat pump unit. All units brand-new, pristine, white or light grey, " +
      "gleaming softly in the sunlight. Realistic contact shadows on the grass under each unit, " +
      "subtle ambient occlusion. Stylised commercial display — units rest directly on the grass. " +
      "Composition leaves the upper half of the frame as clean open sky — generous negative " +
      "space for a centred headline overlay at the top. Subtle rim light on tops and edges of " +
      "each unit from the sun. " +
      "Magazine-quality commercial advertising photography, 50mm lens, vibrant but natural " +
      "colour grading, mid-morning sunlight, slight HDR-clean look. No visible text, no brand " +
      "logos, no model numbers, no readable signage on any unit.",
  },
  {
    slot: "trust",
    out: "src/assets/img/sections/trust-tech-photo.jpg",
    size: "1024x1024",
    prompt:
      "Editorial documentary photograph of a confident, friendly Canadian HVAC technician in " +
      "his mid-30s standing alongside a clean, modern white service van in the driveway of a " +
      "typical Greater Toronto Area suburban two-storey home with red-brick and warm-grey " +
      "siding. The technician wears a clean navy-blue work uniform with subtle generic patches " +
      "(no readable logos), holds a small toolbag in one hand, posture relaxed, smiling warmly " +
      "toward the camera. The van is unbranded, white, professional-looking, parked at a " +
      "slight angle behind him. Bright clean morning sunlight, soft natural shadows, manicured " +
      "lawn, mature green trees lining a calm Canadian residential street. Mood: trustworthy, " +
      "local, dependable, approachable, professional. Editorial commercial lifestyle " +
      "photography, 50mm lens, natural daylight, warm-neutral colour grading. " +
      "No visible text, no readable signage, no brand logos.",
  },
  {
    slot: "quote-band",
    out: "src/assets/img/sections/quote-band-bg.jpg",
    size: "1536x1024",
    prompt:
      "Wide editorial interior lifestyle photograph: a happy Canadian family of four — two " +
      "parents and two children roughly 6 and 10 years old — completely relaxed together on a " +
      "neutral-toned sectional couch in a beautifully cooled modern home on a warm summer " +
      "afternoon. The family looks refreshed and at ease, enjoying cool indoor comfort while " +
      "it is hot outside. Soft warm afternoon sunlight pours through large open windows; lush " +
      "green mature trees and clear blue summer sky visible outside (NO snow, summer setting). " +
      "Hardwood floors, breezy white linen curtains gently catching air, indoor plants on " +
      "shelves, warm-neutral upholstery, a subtle hint of a clean wall-mounted thermostat or " +
      "discreet vent register on the wall. Mood: cool, calm, refreshed, summer comfort, " +
      "family safe at home, premium living. Will be used as a darkened background image with " +
      "text overlay — keep composition simple, even tonality across the frame, no jarring " +
      "hot spots. Editorial architectural lifestyle photography, 24mm wide angle, soft natural " +
      "daylight, warm-neutral colour grading. No text, no brand logos, no readable signage.",
  },
  {
    slot: "faq",
    out: "src/assets/img/sections/faq-bg.jpg",
    size: "1536x1024",
    prompt:
      "Tender editorial lifestyle photograph: a Canadian mother in her early thirties and her " +
      "young child (around 5 to 7 years old) sitting close together on a window seat by a " +
      "large floor-to-ceiling window inside a cozy modern home, looking out together at a " +
      "soft snowfall. Through the window: serene Canadian winter scene, gently falling snow, " +
      "bare trees, soft grey-blue afternoon light. Inside is warm and inviting — warm " +
      "hardwood floor, knit throw blanket, indoor plants, soft golden lamplight, faint glow " +
      "from a side lamp. Mom holds a steaming mug, child leans gently against her, both in " +
      "cozy soft loungewear. Mood: protected, warm, family trust, sheltered from the cold, " +
      "comfort, quiet wonder. Subjects positioned right of centre, leaving generous negative " +
      "space on the left for headline overlay. Soft natural light from the window, warm " +
      "interior fill light. Editorial lifestyle photography, 35mm lens, gentle warm-cool " +
      "contrast between cozy interior and cold exterior. No text, no brand logos.",
  },
  {
    slot: "blog-default",
    out: "src/assets/img/blog/post-default.jpg",
    size: "1536x1024",
    prompt:
      "Clean commercial product photograph of a modern high-efficiency residential furnace " +
      "and air handler unit installed in a well-organized Canadian home basement utility room. " +
      "Brushed steel cabinet, copper refrigerant lines, white walls, polished concrete floor. " +
      "Clean, technical, neat — no clutter. Soft overhead lighting, mild rim light. No people. " +
      "Commercial editorial product photography, 35mm lens. " +
      "No text, no logos, no readable brand markings on the equipment.",
  },

  // ── Service detail page heroes ────────────────────────────────────────────
  {
    slot: "svc-furnace-installation",
    out: "src/assets/img/services/furnace-installation.jpg",
    size: "1536x1024",
    prompt:
      "Two uniformed Canadian HVAC technicians lowering a brand-new high-efficiency white " +
      "residential gas furnace into a tidy GTA basement utility room; clean copper and PVC " +
      "exhaust lines visible, installation in progress, both techs engaged and professional. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-furnace-repair",
    out: "src/assets/img/services/furnace-repair.jpg",
    size: "1536x1024",
    prompt:
      "Single Canadian HVAC technician kneeling at an open furnace cabinet, multimeter in " +
      "hand, diagnosing the control board; warm basement lighting, focused but calm " +
      "expression, clean navy uniform, tool bag open nearby. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-ac-installation",
    out: "src/assets/img/services/ac-installation.jpg",
    size: "1536x1024",
    prompt:
      "Technician levelling a new outdoor central air conditioner condenser on a concrete " +
      "pad beside a GTA suburban home in summer; lush green lawn, refrigerant lines being " +
      "routed neatly along the home's foundation, bright daylight, clean professional setup. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-ac-repair",
    out: "src/assets/img/services/ac-repair.jpg",
    size: "1536x1024",
    prompt:
      "Technician at the side of a GTA home in mid-summer with the outdoor AC condenser top " +
      "fan grille removed, manifold gauges attached to service ports, troubleshooting in " +
      "bright summer daylight; professional, calm, focused posture. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-heat-pump-installation",
    out: "src/assets/img/services/heat-pump-installation.jpg",
    size: "1536x1024",
    prompt:
      "Modern outdoor air-source heat pump unit being installed on a concrete pad beside a " +
      "GTA home in shoulder-season — light snow dusts the lawn but the sky is mild and " +
      "bright, implying year-round heating and cooling capability; tech in navy uniform " +
      "making final connections, pristine white unit, trim residential backdrop. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-ductless-ac",
    out: "src/assets/img/services/ductless-ac.jpg",
    size: "1536x1024",
    prompt:
      "Wall-mounted white ductless mini-split indoor head unit running in a sun-lit modern " +
      "living room or bedroom; clean neutral walls, an indoor plant nearby, soft natural " +
      "window light, subtle sense of comfortable cool air, no people — product-lifestyle " +
      "editorial feel. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-water-heater",
    out: "src/assets/img/services/water-heater.jpg",
    size: "1536x1024",
    prompt:
      "Compact modern wall-hung tankless water heater mounted in a clean, well-lit utility " +
      "closet or basement; tech's hands making a final gas or water connection, copper fittings " +
      "gleaming, white walls, neat and premium — implies endless hot water, modern efficiency. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-fireplaces",
    out: "src/assets/img/services/fireplaces.jpg",
    size: "1536x1024",
    prompt:
      "Warm cozy Canadian living room with a modern linear gas fireplace fully lit, soft " +
      "amber flame glow, clean stone or tile surround, warm evening interior light; " +
      "comfortable neutral furnishings nearby, no people — product-lifestyle editorial, " +
      "inviting and premium, ambiance and supplemental heat. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-hrv-erv",
    out: "src/assets/img/services/hrv-erv.jpg",
    size: "1536x1024",
    prompt:
      "HRV heat recovery ventilator unit ceiling-mounted in a finished GTA basement " +
      "mechanical room with insulated white ducting fanning out to the left and right; " +
      "clean, technical, organised — a soft shaft of daylight from a basement window " +
      "suggests the concept of fresh outdoor air flowing inside. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "svc-maintenance-plans",
    out: "src/assets/img/services/maintenance-plans.jpg",
    size: "1536x1024",
    prompt:
      "Friendly Canadian HVAC technician with a tablet performing a seasonal furnace tune-up " +
      "in a bright GTA basement; composed, professional posture with a warm smile — a " +
      "homeowner is faintly visible in soft background focus, implying a trusted service " +
      "relationship and annual care. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },

  // ── Top-level page heroes ─────────────────────────────────────────────────
  {
    slot: "page-about",
    out: "src/assets/img/hero/about.jpg",
    size: "1536x1024",
    prompt:
      "Three to four diverse Canadian HVAC technicians in clean unbranded navy uniforms " +
      "standing relaxed and smiling in front of an unbranded white professional service van " +
      "on a calm GTA suburban street; mature trees lining the street, morning light, " +
      "team heritage and community feel. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "page-contact",
    out: "src/assets/img/hero/contact.jpg",
    size: "1536x1024",
    prompt:
      "Friendly Canadian HVAC dispatcher or technician smiling while taking a phone call " +
      "on a slim headset, seated in a tidy modern dispatch office or van interior with " +
      "soft natural daylight; warm, approachable, professional — conveys responsive service. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "page-services-index",
    out: "src/assets/img/hero/services-index.jpg",
    size: "1536x1024",
    prompt:
      "Hero overview composition beside a GTA suburban home: a modern outdoor heat pump " +
      "unit and a central AC condenser sit side by side on a concrete pad, while in the " +
      "soft background an open garage door reveals a clean white furnace inside — the " +
      "single frame visually communicates a full suite of HVAC services under one company. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "page-service-areas-index",
    out: "src/assets/img/hero/service-areas-index.jpg",
    size: "1536x1024",
    prompt:
      "Elevated or wide-angle golden-hour summer view of a leafy GTA suburban neighbourhood; " +
      "rows of mature trees, a mix of red-brick and warm-grey two-storey homes along a " +
      "calm residential street, a clear blue sky — evokes the breadth of communities a " +
      "local HVAC company serves across the region. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "page-reviews",
    out: "src/assets/img/hero/reviews.jpg",
    size: "1536x1024",
    prompt:
      "Warm candid moment of a happy Canadian homeowner shaking hands with a uniformed " +
      "technician at a clean residential front door in daylight; both smiling, relaxed " +
      "body language, porch and greenery in background — trust, satisfaction, five-star " +
      "service relationship. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "page-quote",
    out: "src/assets/img/hero/quote.jpg",
    size: "1536x1024",
    prompt:
      "Technician and homeowner side by side at a bright kitchen island reviewing a tablet " +
      "together showing a generic HVAC system diagram (no readable text); both relaxed and " +
      "engaged, soft natural window light, modern kitchen — consultative, trusted, " +
      "transparent quote process. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "page-financing",
    out: "src/assets/img/hero/financing.jpg",
    size: "1536x1024",
    prompt:
      "Quiet editorial still life on a kitchen or home-office table: a tablet showing a " +
      "generic ascending line graph (screen not readable), a steaming coffee mug beside it, " +
      "a Canadian homeowner's hand resting calmly nearby — conveys confident financial " +
      "planning, rebates, and savings without stress. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
  {
    slot: "page-blog-index",
    out: "src/assets/img/hero/blog-index.jpg",
    size: "1536x1024",
    prompt:
      "Editorial flat-lay on a wooden desk: an open laptop (screen angled away, not readable), " +
      "HVAC technician hand tools (a multimeter, a small wrench), a smart thermostat, and an " +
      "open notebook with a pen — knowledge, tips, homeowner education feel, warm daylight " +
      "from a nearby window, clean and inviting. " +
      "Editorial commercial photography for a premium-but-approachable Canadian HVAC company. " +
      "Real Greater Toronto Area residential context, natural daylight, warm-neutral colour " +
      "grading, 35–50mm lens feel, shallow but legible depth of field. Composition leaves " +
      "clean negative space (typically the upper third or one side) for headline text overlay. " +
      "No visible text, no brand logos, no model numbers, no readable signage on any " +
      "equipment, uniform, or surface.",
  },
];

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY env var is not set.");
    console.error('PowerShell:  $env:OPENAI_API_KEY="sk-..."');
    process.exit(1);
  }

  const argv = process.argv.slice(2);
  const force = argv.includes("--force");
  const requestedSlots = argv.filter((a) => !a.startsWith("--"));
  const selected = requestedSlots.length
    ? jobs.filter((j) => requestedSlots.includes(j.slot))
    : jobs;

  if (!selected.length) {
    console.error(`No matching slots. Available: ${jobs.map((j) => j.slot).join(", ")}`);
    process.exit(1);
  }

  const client = new OpenAI();
  console.log(`Model: ${MODEL}`);
  console.log(`Slots: ${selected.map((j) => j.slot).join(", ")}${force ? " (force)" : ""}\n`);

  for (const job of selected) {
    const fullPath = path.join(ROOT, job.out);
    if (fs.existsSync(fullPath) && !force) {
      console.log(`SKIP   ${job.slot.padEnd(14)} ${job.out} (use --force to regenerate)`);
      continue;
    }

    console.log(`GEN    ${job.slot.padEnd(14)} ${job.size}`);
    const t0 = Date.now();
    try {
      const params = {
        model: MODEL,
        prompt: job.prompt,
        size: job.size,
        n: 1,
      };
      if (MODEL.startsWith("gpt-image")) {
        params.quality = "high";
        params.output_format = "jpeg";
      }
      const res = await client.images.generate(params);

      let buf;
      if (res.data[0].b64_json) {
        buf = Buffer.from(res.data[0].b64_json, "base64");
      } else if (res.data[0].url) {
        const r = await fetch(res.data[0].url);
        buf = Buffer.from(await r.arrayBuffer());
      } else {
        throw new Error("API response had neither b64_json nor url");
      }

      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, buf);
      const kb = (buf.length / 1024).toFixed(0);
      console.log(`OK     ${job.slot.padEnd(14)} ${job.out}  (${kb} KB, ${Date.now() - t0}ms)`);
    } catch (err) {
      console.error(`FAIL   ${job.slot.padEnd(14)} ${err.message}`);
      if (err.status === 403 && MODEL === "gpt-image-2") {
        console.error("       gpt-image-2 may require OpenAI org verification or a higher usage tier.");
        console.error("       Verify at https://platform.openai.com/settings/organization/general,");
        console.error('       or fall back: $env:OPENAI_IMAGE_MODEL="gpt-image-1"  (older, widely available)');
        console.error('       or:           $env:OPENAI_IMAGE_MODEL="dall-e-3"');
      }
      process.exitCode = 1;
    }
  }

  console.log("\nNext: npm run build  — eleventy-img will produce AVIF/WebP/JPEG variants.");
}

main();
