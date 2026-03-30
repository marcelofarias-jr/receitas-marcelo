import Spinner from "../Spinner/Spinner";
import styles from "./RecipeCardSkeleton.module.scss";

export default function RecipeCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <Spinner size="md" />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.lineShort} />
        <div className={styles.lineLong} />
        <div className={styles.lineMid} />
      </div>
    </div>
  );
}
