// === Cursor Trail Effect ===
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.inset = "0";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "9999";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const particles = [];
let isClicking = false;
let isHovering = false;
let time = 0;

// Detect hover on buttons, links, etc.
function checkHover(e) {
  const el = document.elementFromPoint(e.clientX, e.clientY);
  return (
    el?.tagName === "A" ||
    el?.tagName === "BUTTON" ||
    el?.closest("a") ||
    el?.closest("button") ||
    el?.getAttribute("role") === "button"
  );
}

// --- Mouse Events ---
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
  isHovering = checkHover(e);

  // Add a few particles
  if (Math.random() > 0.6) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 1.5 + Math.random() * 2.5;
    particles.push({
      x: e.clientX,
      y: e.clientY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: 1,
      size: 1.5 + Math.random() * 3,
    });
  }
});

window.addEventListener("mousedown", () => {
  isClicking = true;
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const velocity = 4 + Math.random() * 3;
    particles.push({
      x: cursor.x,
      y: cursor.y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: 1,
      size: 2 + Math.random() * 6,
    });
  }
});

window.addEventListener("mouseup", () => {
  isClicking = false;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// --- Animation Loop ---
function animate() {
  time += 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update & draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life -= 0.018;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    const opacity = p.life * 0.8;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
    gradient.addColorStop(0, `hsla(186, 100%, 50%, ${opacity * 0.8})`);
    gradient.addColorStop(1, `hsla(200, 60%, 45%, ${opacity * 0.1})`);
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw cursor
  const baseSize = 18;
  const size = isClicking ? baseSize * 1.4 : baseSize;
  const hoverSize = isHovering ? baseSize * 1.2 : baseSize;
  const finalSize = Math.max(size, hoverSize);
  const opacity = isClicking ? 1 : 0.85;

  // Outer rotating ring
  ctx.save();
  ctx.translate(cursor.x, cursor.y);
  ctx.rotate((time * 0.015) % (Math.PI * 2));
  ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.4})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, finalSize * 1.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Main outer ring
  ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, finalSize, 0, Math.PI * 2);
  ctx.stroke();

  // Inner glowing circle
  const innerGradient = ctx.createRadialGradient(
    cursor.x,
    cursor.y,
    0,
    cursor.x,
    cursor.y,
    finalSize
  );
  innerGradient.addColorStop(0, `rgba(0, 212, 255, ${opacity * 0.5})`);
  innerGradient.addColorStop(1, `rgba(0, 153, 204, ${opacity * 0.1})`);
  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, finalSize * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Center dot
  ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, finalSize * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Crosshair
  ctx.strokeStyle = `rgba(0, 212, 255, ${
    opacity * (0.5 + 0.3 * Math.sin(time * 0.05))
  })`;
  ctx.lineWidth = 1.8;
  const crossSize = finalSize * (0.65 + 0.1 * Math.sin(time * 0.03));

  ctx.beginPath();
  ctx.moveTo(cursor.x - crossSize, cursor.y);
  ctx.lineTo(cursor.x + crossSize, cursor.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cursor.x, cursor.y - crossSize);
  ctx.lineTo(cursor.x, cursor.y + crossSize);
  ctx.stroke();

  if (isHovering) {
    ctx.strokeStyle = `rgba(0, 153, 204, ${opacity * 0.6})`;
    ctx.lineWidth = 1.2;
    const diag = finalSize * 0.5;

    ctx.beginPath();
    ctx.moveTo(cursor.x - diag * 0.7, cursor.y - diag * 0.7);
    ctx.lineTo(cursor.x + diag * 0.7, cursor.y + diag * 0.7);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cursor.x + diag * 0.7, cursor.y - diag * 0.7);
    ctx.lineTo(cursor.x - diag * 0.7, cursor.y + diag * 0.7);
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}

animate();

// Hide the normal cursor
document.body.style.cursor = "none";