import { FieldError } from "react-hook-form";
import styles from "./TextareaField.module.scss";

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: FieldError;
};

export default function TextareaField({
  label,
  error,
  id,
  ...props
}: TextareaFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} {...props} aria-invalid={!!error} />
      {error && (
        <span className={styles.errorText} role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}
