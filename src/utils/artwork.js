// Procedural cover artwork for MediaSession (lock screen, Bluetooth headsets).
// Generates a canvas image with theme-appropriate palette, exported as data URLs.

const PALETTES = {
  "meridian-light": {
    bg: "#f3ede1",
    card: "#f8f3e8",
    ink: "#1d1813",
    border: "rgba(38,32,22,0.28)",
    stripe: "#a14a2c", // terracotta
    radius: 0,
    font: '500 var(--fs)px "Source Serif 4", Georgia, serif',
  },
  "meridian-dark": {
    bg: "#1c1812",
    card: "#2a2419",
    ink: "#f3ede1",
    border: "rgba(243,237,225,0.22)",
    stripe: "#cd6a3d",
    radius: 0,
    font: '500 var(--fs)px "Source Serif 4", Georgia, serif',
  },
  "globewave-dark": {
    bg: "#020617",
    card: "rgba(255,255,255,0.06)",
    ink: "#ffffff",
    border: "rgba(255,255,255,0.20)",
    stripe: "#10b981",
    radius: 28,
    font: '600 var(--fs)px "Inter", system-ui, sans-serif',
  },
  "globewave-light": {
    bg: "#f1f5f9",
    card: "#ffffff",
    ink: "#020617",
    border: "rgba(2,6,23,0.18)",
    stripe: "#0d9968",
    radius: 28,
    font: '600 var(--fs)px "Inter", system-ui, sans-serif',
  },
};

function paletteFor(theme, mode) {
  return PALETTES[`${theme}-${mode}`] || PALETTES["meridian-light"];
}

function roundRect(ctx, x, y, w, h, r) {
  if (!r) return ctx.rect(x, y, w, h);
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawArtwork(ctx, size, station, palette) {
  const word = (station?.name || "RADIO").split(" ")[0];

  // Outer card: filled bg, rounded if applicable
  if (palette.radius) {
    ctx.fillStyle = palette.bg;
    roundRect(ctx, 0, 0, size, size, Math.round(size * 0.08));
    ctx.fill();
    ctx.save();
    ctx.clip();
  } else {
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, size, size);
  }

  // Diagonal stripes
  const stripe = Math.max(2, Math.round(size * 0.025));
  const gap = stripe * 3;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = palette.stripe;
  for (let x = -size; x < size; x += stripe + gap) {
    ctx.fillRect(x, -size, stripe, size * 2);
  }
  ctx.restore();

  // Vignette
  const grad = ctx.createRadialGradient(
    size * 0.35,
    size * 0.3,
    size * 0.05,
    size / 2,
    size / 2,
    size * 0.7
  );
  grad.addColorStop(0, "rgba(255,255,255,0.18)");
  grad.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  if (palette.radius) ctx.restore();

  // Hairline border (matches outer shape)
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = Math.max(1, size * 0.005);
  if (palette.radius) {
    roundRect(
      ctx,
      ctx.lineWidth / 2,
      ctx.lineWidth / 2,
      size - ctx.lineWidth,
      size - ctx.lineWidth,
      Math.round(size * 0.08)
    );
    ctx.stroke();
  } else {
    ctx.strokeRect(
      ctx.lineWidth / 2,
      ctx.lineWidth / 2,
      size - ctx.lineWidth,
      size - ctx.lineWidth
    );
  }

  // Word block — bottom-left
  const fontSize = Math.round(size * 0.18);
  ctx.font = palette.font.replace("var(--fs)", String(fontSize));
  ctx.textBaseline = "alphabetic";
  const padX = Math.round(size * 0.04);
  const padY = Math.round(size * 0.025);
  const text = word.length > 8 ? word.slice(0, 8) + "…" : word;
  const m = ctx.measureText(text);
  const cardW = m.width + padX * 2;
  const cardH = fontSize + padY * 2;
  const cardX = Math.round(size * 0.07);
  const cardY = size - cardH - Math.round(size * 0.07);
  const cardR = palette.radius ? Math.round(cardH * 0.25) : 0;

  ctx.fillStyle = palette.card;
  if (cardR) {
    roundRect(ctx, cardX, cardY, cardW, cardH, cardR);
    ctx.fill();
  } else {
    ctx.fillRect(cardX, cardY, cardW, cardH);
  }
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = Math.max(1, size * 0.003);
  if (cardR) {
    roundRect(ctx, cardX, cardY, cardW, cardH, cardR);
    ctx.stroke();
  } else {
    ctx.strokeRect(cardX, cardY, cardW, cardH);
  }
  ctx.fillStyle = palette.ink;
  ctx.fillText(text, cardX + padX, cardY + padY + fontSize * 0.85);
}

const cache = new Map();

export function generateArtwork(station, opts = {}) {
  if (!station) return [];
  const { theme = "meridian", mode = "light", sizes = [256, 512] } = opts;
  const cacheKey = `${station.id || station.name || "default"}|${theme}|${mode}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  if (typeof document === "undefined") return [];

  const palette = paletteFor(theme, mode);
  const out = [];
  for (const size of sizes) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    drawArtwork(ctx, size, station, palette);
    out.push({
      src: canvas.toDataURL("image/png"),
      sizes: `${size}x${size}`,
      type: "image/png",
    });
  }
  cache.set(cacheKey, out);
  return out;
}
