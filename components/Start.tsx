import clsx from "clsx";
import useTranslate from "../hooks/useTranslate";
import styles from "../styles/Start.module.css";

type Props = {
  onClick: (mode: "EASY" | "NORMAL" | "HARD" | "DEVIL") => void;
};
const Start = ({ onClick }: Props) => {
  const t = useTranslate();

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t.title}</div>
      <p className={styles.desc}>{t.desc}</p>
      <button onClick={() => onClick("EASY")} className={styles.button2}>
        <div className={styles.gameTitle}>{t.easy}</div>
        <div className={styles.gameDisc}>
          {t.limit(10)}
          <br />
          <span className={styles.star10_rating} data-rate="2"></span>
        </div>
      </button>
      <button onClick={() => onClick("NORMAL")} className={styles.button2}>
        <div className={styles.gameTitle}>{t.normal}</div>
        <div className={styles.gameDisc}>
          {t.limit(15)}
          <br />
          <span className={styles.star10_rating} data-rate="4.5"></span>
        </div>
      </button>
      <button onClick={() => onClick("HARD")} className={styles.button2}>
        <div className={styles.gameTitle}>{t.hard}</div>
        <div className={styles.gameDisc}>
          {t.limit(20)}
          <br />
          <span className={styles.star10_rating} data-rate="7"></span>
        </div>
      </button>
      <button
        onClick={() => onClick("DEVIL")}
        className={clsx(styles.button2, styles.devil)}
      >
        <div className={styles.gameTitle}>{t.devil}</div>
        <div className={styles.gameDisc}>
          {t.limit(30)}
          <br />
          <span className={styles.star10_rating} data-rate="10"></span>
        </div>
      </button>
    </div>
  );
};
export default Start;
