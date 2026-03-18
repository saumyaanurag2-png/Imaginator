function generate() {
  const text = document.getElementById("inputText").value.toLowerCase();
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "18px Arial";
  ctx.fillStyle = "black";

  if (text.includes("incline") || text.includes("slope")) {
    drawIncline(ctx);
  } 
  else if (text.includes("projectile") || text.includes("thrown")) {
    drawProjectile(ctx);
  } 
  else if (text.includes("spring")) {
    drawSpring(ctx);
  } 
  else {
    ctx.fillText("No diagram detected.", 300, 200);
  }
}

// Inclined Plane
function drawIncline(ctx) {
  ctx.beginPath();
  ctx.moveTo(100, 350);
  ctx.lineTo(600, 350);
  ctx.lineTo(600, 200);
  ctx.closePath();
  ctx.stroke();

  ctx.fillRect(550, 250, 40, 40);

  ctx.fillText("Inclined Plane", 320, 50);
}

// Projectile Motion
function drawProjectile(ctx) {
  ctx.beginPath();

  for (let x = 0; x < 600; x++) {
    let y = 0.004 * x * x;
    ctx.lineTo(x + 50, 350 - y);
  }

  ctx.stroke();
  ctx.fillText("Projectile Motion", 320, 50);
}

// Spring System
function drawSpring(ctx) {
  let startX = 150;
  let y = 220;

  ctx.beginPath();

  for (let i = 0; i < 20; i++) {
    let x = startX + i * 15;
    let offset = (i % 2 === 0) ? -15 : 15;
    ctx.lineTo(x, y + offset);
  }

  ctx.stroke();

  ctx.fillRect(450, 200, 50, 50);
  ctx.fillText("Spring System", 320, 50);
}
