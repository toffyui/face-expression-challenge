import styles from "../styles/Start.module.css";
type Props = {
  onClick: () => void;
};
const Start = ({ onClick }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Face Expression Challenge</div>
      <p>Make the same face as the subject.</p>
      <button onClick={onClick} className={styles.button6}>
        Start!
      </button>
    </div>
  );
};
export default Start;
