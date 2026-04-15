import Image from "next/image";
import styles from "./RecipeImage.module.scss";

type RecipeImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
};

export default function RecipeImage({
  src,
  alt,
  width = 480,
  height = 260,
  sizes,
  priority = false,
  fill = false,
}: RecipeImageProps) {
  if (!src) {
    return <div className={styles.placeholder} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      fill={fill}
      className={fill ? styles.fillImage : undefined}
    />
  );
}
