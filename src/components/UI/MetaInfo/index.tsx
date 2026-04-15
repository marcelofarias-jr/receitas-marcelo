import styles from "./MetaInfo.module.scss";

type MetaInfoProps = {
  items: (string | null | undefined)[];
};

export default function MetaInfo({ items }: MetaInfoProps) {
  const filteredItems = items.filter(Boolean);

  if (filteredItems.length === 0) return null;

  return (
    <div className={styles.meta}>
      {filteredItems.map((item, index) => (
        <span key={index}>{item}</span>
      ))}
    </div>
  );
}
