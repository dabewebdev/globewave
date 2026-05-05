// Procedural cover artwork for MediaSession (lock screen, Bluetooth headsets).
// Generates a canvas image: parchment background + diagonal terracotta stripes +
// station's first word set in a serif. No per-station files needed.

const PALETTE = {
  bg: "#f3ede1",
  bgCard: "#f8f3e8",
  ink: "#1d1813",
  inkSoft: "rgba(29,24,19,0.66)",
  accent: "#a14a2c",
  accentSoft: "rgba(161,74,44,0.18)",
};

function drawArtwork(ctx, size, station) {
  const word = (station?.name || "RADIO").split(" ")[0];

  // Background
  ctx.fillStyle = PALETTE.bgCard;
  ctx.fillRect(0, 0, size, size);

  // Diagonal stripes
  const stripe = Math.max(2, Math.round(size * 0.025));
  const gap = stripe * 3;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = PALETTE.accent;
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
  grad.addColorStop(1, "rgba(38,32,22,0.18)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Hairline border
  ctx.strokeStyle = "rgba(38,32,22,0.28)";
  ctx.lineWidth = Math.max(1, size * 0.005);
  ctx.strokeRect(
    ctx.lineWidth / 2,
    ctx.lineWidth / 2,
    size - ctx.lineWidth,
    size - ctx.lineWidth
  );

  // Word block — bottom-left, on a card
  const fontSize = Math.round(size * 0.18);
  ctx.font = `500 ${fontSize}px "Source Serif 4", Georgia, serif`;
  ctx.textBaseline = "alphabetic";
  const padX = Math.round(size * 0.04);
  const padY = Math.round(size * 0.025);
  const text = word.length > 8 ? word.slice(0, 8) + "…" : word;
  const m = ctx.measureText(text);
  const cardW = m.width + padX * 2;
  const cardH = fontSize + padY * 2;
  const cardX = Math.round(size * 0.07);
  const cardY = size - cardH - Math.round(size * 0.07);
  ctx.fillStyle = PALETTE.bgCard;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = "rgba(38,32,22,0.28)";
  ctx.lineWidth = Math.max(1, size * 0.003);
  ctx.strokeRect(cardX, cardY, cardW, cardH);
  ctx.fillStyle = PALETTE.ink;
  ctx.fillText(text, cardX + padX, cardY + padY + fontSize * 0.85);
}

const cache = new Map();

export function generateArtwork(station, sizes = [256, 512]) {
  if (!station) return [];
  const cacheKey = station.id || station.name || "default";
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  if (typeof document === "undefined") return [];
  const out = [];
  for (const size of sizes) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    drawArtwork(ctx, size, station);
    out.push({
      src: canvas.toDataURL("image/png"),
      sizes: `${size}x${size}`,
      type: "image/png",
    });
  }
  cache.set(cacheKey, out);
  return out;
}
