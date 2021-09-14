export const JaTexts = {
  easy: "簡単",
  normal: "普通",
  hard: "難しい",
  devil: "鬼",
  title: "表情筋チャレンジ",
  metaDesc: "表情筋で遊ぼう！",
  desc: "お題と同じ表情をしてください",
  limit: (sec: number) => `制限時間${sec}秒`,
  rest: (sec: number) => `残り時間: ${sec}秒`,
  good: ["最高!", "良いね!", "完璧"],
  bad: ["もう少し", "惜しい", "全然だめ"],
  first: "すごいで賞",
  second: "まあまあで賞",
  third: "頑張りま賞",
  result: (mode, all, point) =>
    `あなたは${mode}モードに挑戦して${all}回中${point}回成功しました`,
  share: (mode, all, point) =>
    `${mode}モードに挑戦して${all}回中${point}回成功しました`,
  hash: "表情筋チャレンジ",
  tweet: "ツイート",
  restart: "最初から",
};
