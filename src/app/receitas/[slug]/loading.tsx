import Spinner from "../../../components/UI/Spinner";
import styles from "./page.module.scss";
import skeletonStyles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={skeletonStyles.backLinkSkeleton} />

        <div className={skeletonStyles.headerCard}>
          <div className={skeletonStyles.headerImage}>
            <Spinner size="lg" />
          </div>
          <div className={skeletonStyles.headerBody}>
            <div className={skeletonStyles.lineTag} />
            <div className={skeletonStyles.lineTitle} />
            <div className={skeletonStyles.lineMeta} />
          </div>
        </div>

        <div className={skeletonStyles.section}>
          <div className={skeletonStyles.sectionTitle} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={skeletonStyles.listItem} />
          ))}
        </div>

        <div className={skeletonStyles.section}>
          <div className={skeletonStyles.sectionTitle} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={skeletonStyles.stepItem} />
          ))}
        </div>
      </main>
    </div>
  );
}
