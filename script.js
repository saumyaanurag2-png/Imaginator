// ================= STATE =================
let sim = null;
let running = true;

// ================= CONTROLS =================
function getControls() {
  return {
    m: parseFloat(document.getElementById("mass").value),
    k: parseFloat(document.getElementById("k").value),
    g: parseFloat(document.getElementById("g").value)
  };
}

// ================= ENGINE =================
function startSpringSimulation(canvas, ctx) {
  let { m, k } = getControls();

  sim = {
    x: 200,
    v: 0,
    equilibrium: 200
  };

  function loop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let { m, k } = getControls();

    // Hooke’s Law: F = -kx
    let F = -k * (sim.x - sim.equilibrium);
    let a = F / m;

    sim.v += a * 0.1;
    sim.x += sim.v * 0.1;

    drawSpring(ctx, sim.x);
    drawValues(ctx, sim, F);

    requestAnimationFrame(loop);
  }

  loop();
}

// ================= DRAW =================
function drawSpring(ctx, blockX) {
  let y = 220;
  let startX = 80;

  // wall
  ctx.fillRect(60, 180, 20, 80);

  ctx.beginPath();
  ctx.moveTo(startX, y);

  let segments = 20;
  let length = blockX - startX;

  let lastX = startX;
  let lastY = y;

  for (let i = 1; i <= segments; i++) {
    let x = startX + (i / segments) * length;
    let offset = (i % 2 === 0 ? -12 : 12);

    ctx.lineTo(x, y + offset);

    lastX = x;
    lastY = y + offset;
  }

  ctx.stroke();

  // connector
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(blockX, y);
  ctx.stroke();

  // block
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(blockX, y - 25, 50, 50);
}

// ================= VALUES =================
function drawValues(ctx, sim, F) {
  ctx.fillStyle = "black";

  ctx.fillText(`x: ${sim.x.toFixed(1)}`, 20, 30);
  ctx.fillText(`v: ${sim.v.toFixed(2)}`, 20, 50);
  ctx.fillText(`F: ${F.toFixed(2)}`, 20, 70);
}

// ================= UI =================
function generate() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  running = true;
  startSpringSimulation(canvas, ctx);
}

function pauseSim() {
  running = false;
}

function resumeSim() {
  if (!running) {
    running = true;
    generate();
  }
}

function resetSim() {
  running = false;
  generate();
}
