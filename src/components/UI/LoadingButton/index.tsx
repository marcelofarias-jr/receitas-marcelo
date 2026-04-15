import styles from "./LoadingButton.module.scss";

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  isDanger?: boolean;
};

export default function LoadingButton({
  isLoading = false,
  loadingText = "Carregando...",
  isDanger = false,
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  const buttonClass = [
    styles.button,
    isDanger && styles.danger,
    isLoading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} disabled={isLoading || disabled} {...props}>
      {isLoading ? loadingText : children}
    </button>
  );
}
