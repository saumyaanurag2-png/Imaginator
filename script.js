function generate() {
  const text = document.getElementById("inputText").value.toLowerCase();
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (text.includes("incline") || text.includes("slope")) {
    drawIncline(ctx, text);
  } 
  else if (text.includes("projectile") || text.includes("thrown")) {
    drawProjectile(ctx, text);
  } 
  else if (text.includes("spring")) {
    drawSpring(ctx);
  } 
  else {
    ctx.font = "18px Arial";
    ctx.fillText("Diagram type not recognized yet.", 200, 200);
  }
}
