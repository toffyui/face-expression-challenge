export const drawCounts = (ctx: CanvasRenderingContext2D, text: string) => {
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#333c5f";
  ctx.textAlign = "left";
  ctx.font = "bold 40px sans-serif";
  ctx.strokeText(text, 10, 50);
  ctx.fillText(text, 10, 50);
};
