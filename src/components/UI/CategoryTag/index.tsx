import styles from "./CategoryTag.module.scss";

type CategoryTagProps = {
  label: string;
};

export default function CategoryTag({ label }: CategoryTagProps) {
  return <p className={styles.tag}>{label}</p>;
}
