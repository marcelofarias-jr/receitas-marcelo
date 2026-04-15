import Link from "next/link";
import styles from "./RecipeCard.module.scss";
import CategoryTag from "../UI/CategoryTag";
import RecipeImage from "../UI/RecipeImage";
import type { Recipe } from "../../types/recipes";

type RecipeCardProps = {
  recipe: Recipe;
  imageUrl: string;
};

export default function RecipeCard({ recipe, imageUrl }: RecipeCardProps) {
  // Garante que imageUrl nunca é undefined ou null
  const hasImage = Boolean(imageUrl && imageUrl.trim() !== "");
  return (
    <div className={styles.card}>
      <Link href={`/receitas/${recipe.slug}`} className={styles.cardImageLink}>
        <div className={styles.cardImage}>
          {hasImage ? (
            <RecipeImage
              src={imageUrl}
              alt={recipe.titulo}
              width={480}
              height={260}
            />
          ) : (
            <div className={styles.cardImagePlaceholder} />
          )}
        </div>
      </Link>
      <div className={styles.cardBody}>
        <CategoryTag label={recipe.tipo} />
        <Link
          href={`/receitas/${recipe.slug}`}
          className={styles.cardTitleLink}
        >
          <h3>{recipe.titulo}</h3>
        </Link>
        <p className={styles.cardSummary}>{recipe.resumo}</p>
        <div className={styles.cardFooter}>
          <span>{recipe.tempoDePreparo}</span>
        </div>
      </div>
    </div>
  );
}
