// ================= DIAGRAM =================

function generate() {
  const text = document.getElementById("inputText").value.toLowerCase();
  console.log("INPUT:", text);

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";

  // Stronger detection
  if (
    text.includes("incline") ||
    text.includes("slope") ||
    (text.includes("block") && text.includes("angle"))
  ) {
    console.log("Detected: Incline");
    drawIncline(ctx);
  } 
  else if (
    text.includes("projectile") ||
    text.includes("thrown") ||
    (text.includes("velocity") && text.includes("angle"))
  ) {
    console.log("Detected: Projectile");
    drawProjectile(ctx);
  } 
  else if (text.includes("spring")) {
    console.log("Detected: Spring");
    drawSpring(ctx);
  } 
  else {
    console.log("No match");
    ctx.fillText("Diagram not recognized.", 200, 200);
  }
}


// ================= DRAW FUNCTIONS =================

function drawIncline(ctx) {
  ctx.beginPath();
  ctx.moveTo(100, 350);
  ctx.lineTo(500, 350);
  ctx.lineTo(500, 200);
  ctx.closePath();
  ctx.stroke();

  // Block
  ctx.fillRect(460, 250, 40, 40);

  ctx.fillText("Inclined Plane", 250, 50);
}


function drawProjectile(ctx) {
  ctx.beginPath();

  for (let x = 0; x < 400; x++) {
    let y = 0.004 * x * x;
    ctx.lineTo(x + 50, 350 - y);
  }

  ctx.stroke();
  ctx.fillText("Projectile Motion", 250, 50);
}


function drawSpring(ctx) {
  let startX = 120;
  let y = 220;

  ctx.beginPath();

  for (let i = 0; i < 20; i++) {
    let x = startX + i * 15;
    let offset = (i % 2 === 0) ? -15 : 15;
    ctx.lineTo(x, y + offset);
  }

  ctx.stroke();

  ctx.fillRect(420, 200, 50, 50);
  ctx.fillText("Spring System", 250, 50);
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
