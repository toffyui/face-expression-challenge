import { Canvas, createCanvas, registerFont, loadImage } from "canvas";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { EnTexts } from "../../locales/en";
import { JaTexts } from "../../locales/ja";

interface SeparatedText {
  line: string;
  remaining: string;
}

const createTextLine = (canvas: Canvas, text: string): SeparatedText => {
  const context = canvas.getContext("2d");
  const MAX_WIDTH = 800 as const;

  for (let i = 0; i < text.length; i += 1) {
    const line = text.substring(0, i + 1);

    if (context.measureText(line).width > MAX_WIDTH) {
      return {
        line,
        remaining: text.substring(i + 1),
      };
    }
  }

  return {
    line: text,
    remaining: "",
  };
};

const createTextLines = (canvas: Canvas, text: string): string[] => {
  const lines: string[] = [];
  let currentText = text;

  while (currentText !== "") {
    const separatedText = createTextLine(canvas, currentText);
    lines.push(separatedText.line);
    currentText = separatedText.remaining;
  }
  return lines;
};

const createOgp = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { mode, all, point, la } = req.query;
  const t = la === "ja" ? JaTexts : EnTexts;
  const WIDTH = 1200 as const;
  const HEIGHT = 630 as const;
  const DX = 0 as const;
  const DY = 0 as const;
  const canvas = createCanvas(WIDTH, HEIGHT);

  const ctx = canvas.getContext("2d");
  registerFont(path.resolve("./fonts/NotoSansJP-Regular.otf"), {
    family: "Noto",
  });

  ctx.fillRect(DX, DY, WIDTH, HEIGHT);
  ctx.fillStyle = "#333c5f";
  ctx.font = "100px ipagp";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const texts = t.share(t[mode as string], all, point);

  const backgroundImage = await loadImage(
    path.resolve("./images/background.jpg")
  );
  ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT);

  let time: number;
  switch (mode) {
    case "easy":
      time = 10;
      break;
    case "normal":
      time = 15;
      break;
    case "hard":
      time = 20;
      break;
    default:
      time = 30;
  }
  let resultText: string;
  const min = Math.ceil(time / 3);
  if (Number(all) <= min) {
    resultText = t.third;
  } else if (Number(all) >= min * 2) {
    resultText = t.first;
  } else {
    resultText = t.second;
  }
  ctx.fillText(resultText, 600, 130);

  ctx.font = "60px ipagp";
  const lines = createTextLines(canvas, texts);
  lines.forEach((line, index) => {
    const y = 314 + 80 * (index - (lines.length - 1) / 2);
    ctx.fillText(line, 600, y);
  });
  ctx.font = "40px ipagp";
  ctx.fillText(t.title, 850, 550);

  const buffer = canvas.toBuffer();

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": buffer.length,
  });
  res.end(buffer, "binary");
};

export default createOgp;
