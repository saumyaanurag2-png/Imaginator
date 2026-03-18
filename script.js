// ================= ANIMATION ENGINE =================
function animate(drawFn) {
  let frame = 0;

  function loop() {
    frame++;
    drawFn(frame);
    requestAnimationFrame(loop);
  }

  loop();
}


// ================= MAIN GENERATE =================
function generate() {
  const text = document.getElementById("inputText").value.toLowerCase();
  console.log("INPUT:", text);

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";

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
  ctx.beginPath();
  ctx.moveTo(100, 350);
  ctx.lineTo(500, 350);
  ctx.lineTo(500, 200);
  ctx.closePath();
  ctx.stroke();

  ctx.fillRect(460, 250, 40, 40);
  ctx.fillText("Inclined Plane", 250, 50);
}


// ================= PROJECTILE (ANIMATED) =================
function drawProjectileAnimated(ctx, canvas) {
  animate((frame) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();

    for (let x = 0; x < frame; x++) {
      let y = 0.004 * x * x;
      ctx.lineTo(x + 50, 350 - y);
    }

    ctx.stroke();

    let x = frame;
    let y = 0.004 * x * x;

    ctx.beginPath();
    ctx.arc(x + 50, 350 - y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillText("Projectile Motion", 250, 50);
  });
}


// ================= SPRING (ANIMATED) =================
function drawSpringAnimated(ctx, canvas) {
  animate((frame) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let stretch = Math.sin(frame * 0.1) * 20;

    ctx.beginPath();

    for (let i = 0; i < 20; i++) {
      let x = 120 + i * 15;
      let offset = (i % 2 === 0 ? -15 : 15) + stretch;
      ctx.lineTo(x, 220 + offset);
    }

    ctx.stroke();

    ctx.fillRect(420 + stretch, 200, 50, 50);

    ctx.fillText("Spring Oscillation", 250, 50);
  });
}


// ================= FREE BODY DIAGRAM =================
function drawFBD(ctx) {
  ctx.fillRect(300, 200, 50, 50);

  ctx.beginPath();

  // weight
  ctx.moveTo(325, 250);
  ctx.lineTo(325, 320);

  // normal
  ctx.moveTo(325, 200);
  ctx.lineTo(325, 150);

  // friction
  ctx.moveTo(300, 225);
  ctx.lineTo(250, 225);

  ctx.stroke();

  ctx.fillText("Free Body Diagram", 230, 100);
}


// ================= AI ASSISTANT =================
const API_KEY = "YOUR_OPENAI_API_KEY"; // put your key

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
            content: "You are a physics tutor. Give only approach + formulas in short."
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
