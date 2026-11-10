/* cloth-wave.js — Interactive wave displacement on indigo bookcloth
   Zero dependencies. Runs at 60fps, suspends when out of view or idle. */
(() => {
  const canvas = document.querySelector('#cloth-canvas');
  const stage = document.querySelector('.ride-stage');
  if (!canvas || !stage) return;

  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine || matchMedia('(prefers-reduced-motion:reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Simulation resolution (downscaled grid for optimal 60fps performance)
  const COLS = 96;
  const ROWS = 60;
  const SIZE = COLS * ROWS;
  const DAMPING = 0.982;

  let h1 = new Float32Array(SIZE);
  let h2 = new Float32Array(SIZE);
  let active = false;
  let inView = false;
  let animId = null;
  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.width = stage.clientWidth;
    height = canvas.height = stage.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Add disturbance at (gx, gy)
  function perturb(gx, gy, strength, radius) {
    const r2 = radius * radius;
    const minX = Math.max(1, Math.floor(gx - radius));
    const maxX = Math.min(COLS - 2, Math.ceil(gx + radius));
    const minY = Math.max(1, Math.floor(gy - radius));
    const maxY = Math.min(ROWS - 2, Math.ceil(gy + radius));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dx = x - gx;
        const dy = y - gy;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const factor = Math.cos((Math.sqrt(d2) / radius) * (Math.PI / 2));
          h1[y * COLS + x] += strength * factor;
        }
      }
    }
    if (!active && inView) {
      active = true;
      tick();
    }
  }

  let lastX = 0, lastY = 0, hasMoved = false;

  stage.addEventListener('pointermove', (e) => {
    const rect = stage.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (px < 0 || px > rect.width || py < 0 || py > rect.height) return;

    const gx = (px / rect.width) * (COLS - 1);
    const gy = (py / rect.height) * (ROWS - 1);

    if (hasMoved) {
      const dist = Math.hypot(px - lastX, py - lastY);
      const strength = Math.min(dist * 0.45, 14.0);
      perturb(gx, gy, strength, 3.8);
    } else {
      hasMoved = true;
      perturb(gx, gy, 8.0, 3.5);
    }
    lastX = px;
    lastY = py;
  }, { passive: true });

  // Render loop
  function tick() {
    if (!inView) {
      active = false;
      return;
    }

    let maxEnergy = 0;

    // Wave equation step
    for (let y = 1; y < ROWS - 1; y++) {
      const row = y * COLS;
      for (let x = 1; x < COLS - 1; x++) {
        const idx = row + x;
        const val = ((h1[idx - 1] + h1[idx + 1] + h1[idx - COLS] + h1[idx + COLS]) * 0.5 - h2[idx]) * DAMPING;
        h2[idx] = val;
        const absVal = Math.abs(val);
        if (absVal > maxEnergy) maxEnergy = absVal;
      }
    }

    // Swap buffers
    const temp = h1;
    h1 = h2;
    h2 = temp;

    // Render highlights
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1.2;

    const stepX = width / (COLS - 1);
    const stepY = height / (ROWS - 1);

    // Draw horizontal weave lines with dynamic specular deformation
    for (let y = 2; y < ROWS - 2; y += 2) {
      let drawing = false;
      ctx.beginPath();
      for (let x = 1; x < COLS - 1; x++) {
        const idx = y * COLS + x;
        const h = h1[idx];
        const nx = h1[idx + 1] - h1[idx - 1];
        const ny = h1[idx + COLS] - h1[idx - COLS];
        // Light vector from top-left: specular sheen
        const spec = Math.max(0, -nx * 0.7 - ny * 0.7);

        if (Math.abs(h) > 0.08 || spec > 0.05) {
          const posX = x * stepX;
          const posY = y * stepY + h * 0.65;
          if (!drawing) {
            ctx.moveTo(posX, posY);
            drawing = true;
          } else {
            ctx.lineTo(posX, posY);
          }
        } else if (drawing) {
          ctx.stroke();
          ctx.beginPath();
          drawing = false;
        }
      }
      if (drawing) {
        ctx.strokeStyle = 'rgba(206, 183, 131, 0.16)';
        ctx.stroke();
      }
    }

    // Check if energy dropped below threshold to sleep
    if (maxEnergy > 0.05) {
      animId = requestAnimationFrame(tick);
    } else {
      active = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  // Observe stage visibility
  const observer = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView && !active) {
      // gentle initial breathe ripple
      perturb(COLS * 0.5, ROWS * 0.5, 4.0, 5.0);
    } else if (!inView && animId) {
      cancelAnimationFrame(animId);
      active = false;
    }
  }, { threshold: 0.1 });

  observer.observe(stage);
})();
