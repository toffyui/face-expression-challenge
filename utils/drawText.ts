export const drawText = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string,
  color: string
) => {
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.font = "bold 140px sans-serif";
  ctx.fillText(text, canvas.width / 2, (canvas.height + 130) / 2);
};
