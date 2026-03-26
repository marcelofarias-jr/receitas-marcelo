import styles from "./CategoryChip.module.scss";

type CategoryChipProps = {
  label: string;
  isActive: boolean;
  onSelect: (label: string) => void;
};

export default function CategoryChip({
  label,
  isActive,
  onSelect,
}: CategoryChipProps) {
  return (
    <button
      type="button"
      className={`${styles.categoryChip} ${
        isActive ? styles.categoryChipActive : ""
      }`}
      onClick={() => onSelect(label)}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
