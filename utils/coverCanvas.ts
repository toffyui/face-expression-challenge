export const coverCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e0e7ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
