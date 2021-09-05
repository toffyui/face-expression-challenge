export const drawText = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string
) => {
  ctx.fillStyle = "#333c5f";
  ctx.textAlign = "center";
  ctx.font = "bold 150px sans-serif";
  ctx.fillText(text, canvas.width / 2, (canvas.height + 130) / 2);
};
