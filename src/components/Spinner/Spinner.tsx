import styles from "./Spinner.module.scss";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

export default function Spinner({ size = "md" }: SpinnerProps) {
  return <div className={`${styles.spinner} ${styles[size]}`} />;
}
