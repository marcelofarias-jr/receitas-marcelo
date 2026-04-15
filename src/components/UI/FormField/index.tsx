import { FieldError } from "react-hook-form";
import styles from "./FormField.module.scss";

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
};

export default function FormField({
  label,
  error,
  id,
  ...props
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} aria-invalid={!!error} />
      {error && (
        <span className={styles.errorText} role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}
