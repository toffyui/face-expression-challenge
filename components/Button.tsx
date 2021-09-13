import styles from "../styles/Button.module.css";

type Props = {
  onClick: () => void;
  text: string;
  type: "tweet" | "restart";
};
const Button = ({ onClick, text, type }: Props) => {
  return (
    <button
      className={type === "tweet" ? styles.tweet : styles.restart}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
