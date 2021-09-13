interface SeparatedText {
  line: string;
  remaining: string;
}

const createTextLine = (
  canvas: HTMLCanvasElement,
  text: string
): SeparatedText => {
  const context = canvas.getContext("2d");
  const MAX_WIDTH = 400 as const;
  for (let i = 0; i < text?.length; i += 1) {
    const line = text?.substring(0, i + 1);

    if (context.measureText(line).width > MAX_WIDTH) {
      return {
        line,
        remaining: text?.substring(i + 1),
      };
    }
  }

  return {
    line: text,
    remaining: "",
  };
};

const createTextLines = (canvas: HTMLCanvasElement, text: string): string[] => {
  const lines: string[] = [];
  let currentText = text;

  while (currentText !== "") {
    const separatedText = createTextLine(canvas, currentText);
    lines.push(separatedText?.line);
    currentText = separatedText?.remaining;
  }
  return lines;
};

export const drawResultCanvas = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  mode: string,
  text: string
) => {
  const image = document.createElement("img");
  image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#333c5f";
    ctx.textAlign = "center";
    ctx.font = "bold 80px sans-serif";
    ctx.fillText(mode, canvas.width / 2, 130);

    ctx.font = "40px sans-serif";
    const lines = createTextLines(canvas, text);
    lines.forEach((line, index) => {
      const y = 50 + canvas.height / 2 + 50 * (index - (lines.length - 1) / 2);
      ctx.fillText(line, canvas.width / 2, y);
    });
  };
  image.src = "/background.jpg";
};
