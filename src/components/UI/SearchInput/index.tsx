import styles from "./SearchInput.module.scss";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onClear?: () => void;
  hasValue?: boolean;
};

export default function SearchInput({
  value,
  onClear,
  hasValue = !!value,
  placeholder = "Buscar...",
  ...props
}: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className={styles.input}
        value={value}
        placeholder={placeholder}
        {...props}
      />
      {hasValue && onClear && (
        <button
          className={styles.clear}
          onClick={onClear}
          aria-label="Limpar"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}
