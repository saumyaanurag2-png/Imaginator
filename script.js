// ================= ANIMATION ENGINE =================
let currentAnimation = null;

function animate(drawFn) {
  if (currentAnimation) cancelAnimationFrame(currentAnimation);

  let frame = 0;

  function loop() {
    frame++;
    drawFn(frame);
    currentAnimation = requestAnimationFrame(loop);
  }

  loop();
}


// ================= UTILS =================

// Draw arrow with head
function drawArrow(ctx, x1, y1, x2, y2, label) {
  const angle = Math.atan2(y2 - y1, x2 - x1);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // arrow head
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(angle - 0.3), y2 - 10 * Math.sin(angle - 0.3));
  ctx.lineTo(x2 - 10 * Math.cos(angle + 0.3), y2 - 10 * Math.sin(angle + 0.3));
  ctx.closePath();
  ctx.fill();

  // label
  if (label) ctx.fillText(label, x2 + 5, y2 + 5);
}


// Draw better block
function drawBlock(ctx, x, y, w, h) {
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = "black";
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "black";
}


// ================= MAIN =================
function generate() {
  const text = document.getElementById("inputText").value.toLowerCase();
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";

  if (text.includes("incline") || text.includes("slope")) {
    drawIncline(ctx);
  } 
  else if (text.includes("projectile") || text.includes("thrown")) {
    drawProjectileAnimated(ctx, canvas);
  } 
  else if (text.includes("spring")) {
    drawSpringAnimated(ctx, canvas);
  } 
  else if (text.includes("force") || text.includes("fbd")) {
    drawFBD(ctx);
  } 
  else {
    ctx.fillText("Diagram not recognized.", 200, 200);
  }
}


// ================= INCLINE =================
function drawIncline(ctx) {
  // slope
  ctx.beginPath();
  ctx.moveTo(100, 350);
  ctx.lineTo(500, 350);
  ctx.lineTo(500, 200);
  ctx.closePath();
  ctx.stroke();

  // block
  drawBlock(ctx, 440, 250, 50, 50);

  // forces
  drawArrow(ctx, 465, 250, 465, 180, "N");
  drawArrow(ctx, 465, 300, 465, 370, "mg");
  drawArrow(ctx, 440, 275, 380, 275, "f");

  ctx.fillText("Inclined Plane", 240, 50);
}


// ================= PROJECTILE =================
function drawProjectileAnimated(ctx, canvas) {
  let vx = 6;
  let vy = -10;
  let g = 0.3;

  animate((frame) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = 50 + vx * frame;
    let y = 300 + vy * frame + 0.5 * g * frame * frame;

    // trajectory
    ctx.beginPath();
    for (let t = 0; t < frame; t++) {
      let tx = 50 + vx * t;
      let ty = 300 + vy * t + 0.5 * g * t * t;
      ctx.lineTo(tx, ty);
    }
    ctx.stroke();

    // ball
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.fillText("Projectile Motion", 240, 50);
  });
}


// ================= SPRING =================
function drawSpringAnimated(ctx, canvas) {
  let baseX = 120;
  let y = 220;

  animate((frame) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // realistic oscillation
    let stretch = Math.sin(frame * 0.08) * 40 * Math.exp(-frame * 0.005);

    // wall
    ctx.fillRect(80, 180, 20, 80);

    // spring
    ctx.beginPath();
    ctx.moveTo(100, y);

    for (let i = 0; i < 15; i++) {
      let x = 100 + i * 15 + (stretch * i) / 15;
      let offset = i % 2 === 0 ? -15 : 15;
      ctx.lineTo(x, y + offset);
    }

    ctx.stroke();

    // block ATTACHED properly
    let blockX = 100 + 15 * 15 + stretch;
    drawBlock(ctx, blockX, y - 25, 50, 50);

    ctx.fillText("Spring Oscillation", 240, 50);
  });
}


// ================= FBD =================
function drawFBD(ctx) {
  drawBlock(ctx, 300, 200, 60, 60);

  drawArrow(ctx, 330, 200, 330, 130, "N");
  drawArrow(ctx, 330, 260, 330, 340, "mg");
  drawArrow(ctx, 300, 230, 240, 230, "f");

  ctx.fillText("Free Body Diagram", 230, 100);
}


// ================= AI ASSISTANT =================
const API_KEY = "YOUR_OPENAI_API_KEY";

async function sendMessage() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");

  const userText = input.value;
  if (!userText) return;

  chatBox.innerHTML += `<div><b>You:</b> ${userText}</div>`;
  input.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Give physics approach and formulas only, concise."
          },
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    chatBox.innerHTML += `<div><b>AI:</b> ${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    chatBox.innerHTML += `<div>Error connecting to AI</div>`;
  }
}
