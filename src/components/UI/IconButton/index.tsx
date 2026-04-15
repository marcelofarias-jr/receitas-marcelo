import React from "react";
import styles from "./IconButton.module.scss";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  isDanger?: boolean;
  isSmall?: boolean;
};

export default function IconButton({
  icon,
  isDanger = false,
  isSmall = false,
  className,
  ...props
}: IconButtonProps) {
  const buttonClass = [
    styles.button,
    isDanger && styles.danger,
    isSmall && styles.small,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} {...props}>
      {icon}
    </button>
  );
}
