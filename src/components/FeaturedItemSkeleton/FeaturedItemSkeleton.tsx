import Spinner from "../Spinner/Spinner";
import styles from "./FeaturedItemSkeleton.module.scss";

export default function FeaturedItemSkeleton() {
  return (
    <div className={styles.featuredCard}>
      <div className={styles.featuredThumb}>
        <Spinner size="sm" />
      </div>
      <div className={styles.featuredBody}>
        <div className={styles.lineTag} />
        <div className={styles.lineTitle} />
        <div className={styles.lineMeta} />
      </div>
    </div>
  );
}
