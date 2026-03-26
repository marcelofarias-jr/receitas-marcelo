import Image from "next/image";
import Link from "next/link";
import styles from "./RecipeCard.module.scss";
import type { Recipe } from "../../types/recipes";

type RecipeCardProps = {
  recipe: Recipe;
  imageUrl: string;
};

export default function RecipeCard({ recipe, imageUrl }: RecipeCardProps) {
  return (
    <Link href={`/receitas/${recipe.slug}`} className={styles.card}>
      <div className={styles.cardImage}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.titulo}
            width={480}
            height={320}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 360px"
          />
        ) : (
          <div className={styles.cardImagePlaceholder} />
        )}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardTag}>{recipe.tipo}</p>
        <h3>{recipe.titulo}</h3>
        <p className={styles.cardSummary}>{recipe.resumo}</p>
        <div className={styles.cardMeta}>
          <span>{recipe.tempoDePreparo}</span>
          <span>{recipe.rendimento}</span>
        </div>
      </div>
    </Link>
  );
}
