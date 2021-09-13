export const levelConfig = {
  EASY: {
    name: "easy",
    time: 10,
    threshold: 0.5,
  },
  NORMAL: {
    name: "normal",
    time: 15,
    threshold: 0.7,
  },
  HARD: {
    name: "hard",
    time: 20,
    threshold: 0.95,
  },
  DEVIL: {
    name: "devil",
    time: 30,
    threshold: 0.99,
  },
} as const;
