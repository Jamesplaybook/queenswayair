const { Resend } = require("resend");

const REQUIRED_FIELDS = ["name", "phone"];
const RATE_LIMIT_MAP  = new Map(); // IP → last submit timestamp
const RATE_LIMIT_MS   = 60_000;    // 1 submission per IP per minute

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method not allowed");
  }

  // Parse body — Vercel auto-parses JSON when content-type is application/json,
  // but we also need to handle form-encoded for the no-JS fallback.
  let fields = {};
  const ct = (req.headers["content-type"] || "").toLowerCase();

  if (ct.includes("application/json")) {
    fields = typeof req.body === "object" && req.body !== null
      ? req.body
      : (() => { try { return JSON.parse(req.body); } catch { return null; } })();
    if (!fields) return error(res, 400, "Invalid JSON");
  } else {
    // form-urlencoded — req.body is a string in Node runtime
    const raw = typeof req.body === "string"
      ? req.body
      : await readRawBody(req);
    const params = new URLSearchParams(raw || "");
    for (const [k, v] of params.entries()) fields[k] = v;
  }

  // Honeypot — silently accept
  if (fields["bot-field"]) {
    return res.status(200).json({ ok: true });
  }

  // IP rate limit
  const ip = (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() || "unknown";
  const now = Date.now();
  const last = RATE_LIMIT_MAP.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    return error(res, 429, "Too many requests. Please wait a moment.");
  }
  RATE_LIMIT_MAP.set(ip, now);

  // Required field validation
  for (const field of REQUIRED_FIELDS) {
    if (!fields[field]?.trim()) {
      return error(res, 400, `Missing required field: ${field}`);
    }
  }

  // Env check
  const toEmail   = process.env.LEAD_TO_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL || "noreply@queenswayair.ca";
  if (!process.env.RESEND_API_KEY || !toEmail) {
    console.error("Missing RESEND_API_KEY or LEAD_TO_EMAIL env vars");
    return error(res, 500, "Server configuration error");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const serviceType = fields.service || "Not specified";
  const subject = `New Lead: ${serviceType} — ${fields.name} (${fields.postal || "no postal"})`;

  const html = `
<h2>New HVAC Lead — Queensway Heating and Cooling</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px;">
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Name</td><td style="padding:6px 12px;">${esc(fields.name)}</td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Phone</td><td style="padding:6px 12px;"><a href="tel:${esc(fields.phone.replace(/\D/g,''))}">${esc(fields.phone)}</a></td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Email</td><td style="padding:6px 12px;">${fields.email ? `<a href="mailto:${esc(fields.email)}">${esc(fields.email)}</a>` : '—'}</td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Postal Code</td><td style="padding:6px 12px;">${esc(fields.postal || '—')}</td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Service Needed</td><td style="padding:6px 12px;">${esc(serviceType)}</td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Best Callback Time</td><td style="padding:6px 12px;">${esc(fields.callback || '—')}</td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Message</td><td style="padding:6px 12px;">${esc(fields.message || '—').replace(/\n/g, '<br>')}</td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">How They Found Us</td><td style="padding:6px 12px;">${esc(fields.source || '—')}</td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Form</td><td style="padding:6px 12px;">${esc(fields['form-name'] || 'unknown')}</td></tr>
  <tr><td style="padding:6px 12px;background:#f6f6f6;font-weight:bold;">Submitted</td><td style="padding:6px 12px;">${new Date().toLocaleString('en-CA', {timeZone:'America/Toronto'})}</td></tr>
</table>
`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to:   toEmail,
      replyTo: fields.email || undefined,
      subject,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Resend error:", e);
    return error(res, 500, "Failed to send email. Please try again.");
  }
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function error(res, code, message) {
  return res.status(code).json({ ok: false, error: message });
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
