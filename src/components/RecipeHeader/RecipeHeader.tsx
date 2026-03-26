import Image from "next/image";
import styles from "./RecipeHeader.module.scss";
import type { Recipe } from "../../types/recipes";

type RecipeHeaderProps = {
  recipe: Recipe;
  imageUrl: string;
};

export default function RecipeHeader({ recipe, imageUrl }: RecipeHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <p className={styles.tag}>{recipe.tipo}</p>
        <h1>{recipe.titulo}</h1>
        <p className={styles.summary}>{recipe.resumo}</p>
        <div className={styles.meta}>
          <span>{recipe.tempoDePreparo}</span>
          <span>{recipe.rendimento}</span>
          <span>{recipe.vegano ? "Vegano" : "Tradicional"}</span>
        </div>
      </div>
      <div className={styles.headerImage}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.titulo}
            width={720}
            height={520}
            sizes="(max-width: 1024px) 95vw, 540px"
            priority
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
    </header>
  );
}
