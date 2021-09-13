export const drawProgressBar = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  count: number
) => {
  const aspect = (canvas.width - 20) / 100;
  const percentage = (1 - count / 3) * aspect * 100;
  ctx.fillStyle = "#333c5f";
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(10, canvas.height - 50, percentage, 5);
  ctx.fillRect(10, canvas.height - 50, percentage, 5);
};
