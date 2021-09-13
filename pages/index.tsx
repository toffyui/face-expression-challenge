import React, { useEffect, useRef, useState } from "react";
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
import { drawCounts } from "../utils/drawCounts";
import { drawProgressBar } from "../utils/drawProgressBar";
import Button from "../components/Button";
import useTranlate from "../hooks/useTranslate";
import { drawResultCanvas } from "../utils/drawResultCanvas";

export default function Home() {
  const t = useTranlate();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isMatch, setIsMatch] = useState<boolean>(false);
  const [gameCount, setGameCount] = useState<number>(0);
  const [subjectExpression, setSubjectExpression] = useState<string>();
  const [point, setPoint] = useState<number>(0);
  const [intervalHandler, setIntervalHandler] = useState<NodeJS.Timer>();
  const [secCount, setSecCount] = useState<number>(0);
  const [playCount, setPlayCount] = useState<number>(0);
  const [level, setLevel] = useState<"EASY" | "NORMAL" | "HARD" | "DEVIL">(
    "NORMAL"
  );
  const [stage, setStage] = useState<
    "isNotStart" | "ready" | "start" | "judge" | "result" | "finish"
  >("isNotStart");

  const handleStart = (mode: "EASY" | "NORMAL" | "HARD" | "DEVIL") => {
    setLevel(mode);
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
      drawText(ctx, canvas, "3", "#333c5f");
      setTimeout(() => {
        coverCanvas(ctx, canvas);
        drawText(ctx, canvas, "2", "#333c5f");
      }, 1000);
      setTimeout(() => {
        coverCanvas(ctx, canvas);
        drawText(ctx, canvas, "1", "#333c5f");
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
        // 判定後、1500msでゲーム再開する
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
      let resultText: string;
      const min = Math.ceil(levelConfig[level].time / 3);
      if (gameCount <= min) {
        resultText = t.third;
      } else if (gameCount >= min * 2) {
        resultText = t.first;
      } else {
        resultText = t.second;
      }
      coverCanvas(ctx, canvas);
      drawResultCanvas(
        ctx,
        canvas,
        resultText,
        t.result(t[levelConfig[level].name], gameCount, point)
      );
    }
  }, [stage]);

  const drawResult = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const random = Math.floor(Math.random() * 3);
    if (!isMatch) {
      coverCanvas(ctx, canvas);
      drawText(ctx, canvas, t.bad[random], "#333c5f");
    } else {
      setPoint((point) => point + 1);
      coverCanvas(ctx, canvas);
      drawText(ctx, canvas, t.good[random], "#fc2600");
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
    if (stage === "judge") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCounts(
        ctx,
        t.rest(levelConfig[level].time - Math.floor(playCount / 10))
      );
      drawProgressBar(ctx, canvas, secCount / 10);
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

  const twitterURL = () => {
    const shareText = t.share(t[levelConfig[level].name], gameCount, point);
    const hash = `#${t.hash}`;
    return (
      `https://twitter.com/intent/tweet?url=${process.env.NEXT_PUBLIC_SHARE_URL}/${levelConfig[level].name}/${gameCount}/${point}&text=` +
      encodeURIComponent(shareText + `\r\n` + hash)
    );
  };

  const shareClick = () => {
    const url = twitterURL();
    window.open(url, "_blank");
  };

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
        <meta name="description" content={t.metaDesc} />
        <meta property="og:site_name" content={t.title} />
        <meta property="og:image" key="ogImage" content="/emojis/happy.png" />
        <link rel="icon" href="/emojis/happy.png" />
        <meta name="twitter:site" content="@yui_active" />
      </Head>
      <main className={styles.main}>
        <div className={styles.videoContainer}>
          <Webcam audio={false} ref={webcamRef} className={styles.video} />
          <canvas ref={canvasRef} className={styles.video} />
        </div>
        {stage === "finish" && (
          <div className={styles.shareButton}>
            <Button onClick={shareClick} text={"Tweet"} type="tweet" />
            <Button
              onClick={() => {
                setStage("isNotStart"), setPlayCount(0);
              }}
              text={"Restart"}
              type="restart"
            />
          </div>
        )}
      </main>
      {!isLoaded && <Loader />}
      {stage === "isNotStart" && (
        <Start onClick={(mode) => handleStart(mode)} />
      )}
    </>
  );
}
