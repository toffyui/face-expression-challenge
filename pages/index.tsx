import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Loader from "../components/Loader";
import Start from "../components/Start";
import { coverCanvas } from "../utils/coverCanvas";
import { drawText } from "../utils/drawText";
import { levelConfig } from "../utils/levelConfig";
import { ExpressionTypes } from "../models/expressions";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isMatch, setIsMatch] = useState<boolean>(false);
  const [gameCount, setGameCount] = useState<number>(0);
  const [subjectExpression, setSubjectExpression] = useState<string>();
  const [point, setPoint] = useState<number>(0);
  const [intervalHandler, setIntervalHandler] = useState<NodeJS.Timer>();
  const [secCount, setSecCount] = useState<number>(0);
  const [playCount, setPlayCount] = useState<number>(0);
  const [level, setLevel] = useState<"EASY" | "NORMAL" | "HARD">("HARD");
  const [stage, setStage] = useState<
    "isNotStart" | "ready" | "start" | "judge" | "result" | "finish"
  >("isNotStart");

  const handleStart = () => {
    setIsStart(true);
    StartGame();
  };

  const loadModels = async () => {
    const MODEL_URL = `/models`;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.load(MODEL_URL),
      faceapi.nets.faceExpressionNet.load(MODEL_URL),
    ]);
  };

  const handleLoadWaiting = async () => {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (webcamRef.current?.video?.readyState == 4) {
          resolve(true);
          clearInterval(timer);
        }
      }, 500);
    });
  };

  const StartGame = () => {
    setStage("ready");
    if (webcamRef.current && canvasRef.current) {
      setIsLoaded(true);
      const webcam = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;
      webcam.width = webcam.videoWidth;
      webcam.height = webcam.videoHeight;
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      const ctx = canvas.getContext("2d");
      coverCanvas(ctx, canvas);
      drawText(ctx, canvas, "3");
      setTimeout(() => {
        coverCanvas(ctx, canvas);
        drawText(ctx, canvas, "2");
      }, 1000);
      setTimeout(() => {
        coverCanvas(ctx, canvas);
        drawText(ctx, canvas, "1");
      }, 2000);
      setTimeout(() => {
        setStage("start");
      }, 3000);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (stage === "result") {
      drawResult(ctx, canvas);
      if (playCount < levelConfig[level].time * 10) {
        // 判定後、1500sでゲーム再開する
        setTimeout(() => {
          setStage("start");
        }, 1500);
      }
    }
    if (stage === "start") {
      const expression =
        ExpressionTypes[Math.floor(Math.random() * ExpressionTypes.length)];
      setSubjectExpression(expression);
      drawSubject(expression);
      setTimeout(() => {
        setStage("judge");
      }, 1500);
    }
    if (stage === "judge") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      judgeHandler(subjectExpression);
    }
    if (stage === "finish") {
      if (intervalHandler) {
        clearInterval(intervalHandler);
      }
      coverCanvas(ctx, canvas);
      drawText(ctx, canvas, `${point}／${gameCount}`);
    }
  }, [stage]);

  const drawResult = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    if (!isMatch) {
      coverCanvas(ctx, canvas);
      drawText(ctx, canvas, "BAD");
    } else {
      setPoint((point) => point + 1);
      coverCanvas(ctx, canvas);
      drawText(ctx, canvas, "GOOD");
    }
  };

  const drawSubject = (expression: string) => {
    setGameCount((gameCount) => gameCount + 1);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = document.createElement("img");
    image.onload = () => {
      coverCanvas(ctx, canvas);
      ctx.drawImage(
        image,
        (canvas.width - 300) / 2,
        (canvas.height - 300) / 2,
        300,
        300
      );
    };
    image.src = `/emojis/${expression}.png`;
  };

  useEffect(() => {
    if (secCount === 30) {
      clearInterval(intervalHandler);
      setStage("result");
    }
    if (playCount === levelConfig[level].time * 10) {
      if (intervalHandler) {
        clearInterval(intervalHandler);
      }
      setStage("finish");
    }
  }, [secCount, playCount]);

  const judgeHandler = (subject: string) => {
    setSecCount(0);
    setIsMatch(false);
    const video = webcamRef.current.video;
    const intervalHandler = setInterval(async () => {
      setSecCount((sec) => sec + 1);
      setPlayCount((sec) => sec + 1);
      const detectionsWithExpression = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
      if (detectionsWithExpression) {
        const Array = Object.entries(detectionsWithExpression.expressions);
        const scoresArray = Array.map((i) => i[1]);
        const expressionsArray = Array.map((i) => i[0]);
        const max = Math.max.apply(null, scoresArray);
        const index = scoresArray.findIndex((score) => score === max);
        const expression = expressionsArray[index];
        if (
          expression === subject &&
          Array[index][1] >= levelConfig[level].threshold
        ) {
          clearInterval(intervalHandler);
          setIsMatch(true);
          setStage("result");
        }
      }
    }, 100);
    setIntervalHandler(intervalHandler);
  };

  useEffect(() => {
    const load = async () => {
      await loadModels();
      await handleLoadWaiting();
    };
    load();
  }, []);

  return (
    <>
      <Head>
        <title>Face Expression Challenge</title>
        <meta name="description" content="Face Expression Challenge" />
        <meta property="og:image" key="ogImage" content="/emojis/happy.png" />
        <link rel="icon" href="/emojis/happy.png" />
      </Head>
      <div className={styles.header}>
        <h1 className={styles.title}>Face Expression Challenge</h1>
      </div>
      <main className={styles.main}>
        <div className={styles.videoContainer}>
          <Webcam audio={false} ref={webcamRef} className={styles.video} />
          <canvas ref={canvasRef} className={styles.video} />
        </div>
      </main>
      {!isLoaded && <Loader />}
      {!isStart && <Start onClick={handleStart} />}
    </>
  );
}
