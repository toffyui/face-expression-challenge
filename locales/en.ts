export const EnTexts = {
  easy: "EASY",
  normal: "NORMAL",
  hard: "HARD",
  devil: "DEVIL",
  title: "Face Expression Challenge",
  metaDesc: "Let's play with face expression",
  desc: "Make the same face as the subject.",
  limit: (sec: number) => `Time limit: ${sec} seconds`,
  rest: (sec: number) => `Remaining: ${sec} seconds`,
  good: ["Good", "Perfect", "OK"],
  bad: ["Bad", "NG", "Worst"],
  first: "Well done",
  second: "Good job",
  third: "So-so",
  result: (mode, all, point) =>
    `You challenged ${mode} mode, then you passed ${point}/${all}`,
  share: (mode, all, point) =>
    `I challenged ${mode} mode, then I passed ${point}/${all}`,
  hash: "FaceExpressionChallenge",
};
