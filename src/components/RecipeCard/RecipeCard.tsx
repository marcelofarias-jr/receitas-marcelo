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
    <div className={styles.card}>
      <Link href={`/receitas/${recipe.slug}`} className={styles.cardImageLink}>
        <div className={styles.cardImage}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.titulo}
              width={480}
              height={260}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 360px"
            />
          ) : (
            <div className={styles.cardImagePlaceholder} />
          )}
        </div>
      </Link>
      <div className={styles.cardBody}>
        <p className={styles.cardTag}>{recipe.tipo}</p>
        <Link
          href={`/receitas/${recipe.slug}`}
          className={styles.cardTitleLink}
        >
          <h3>{recipe.titulo}</h3>
        </Link>
        <p className={styles.cardSummary}>{recipe.resumo}</p>
        <div className={styles.cardFooter}>
          <div className={styles.cardMeta}>
            <span>{recipe.tempoDePreparo}</span>
            <span>{recipe.rendimento}</span>
          </div>
          <Link href={`/receitas/${recipe.slug}`} className={styles.verMais}>
            Ver receita completa →
          </Link>
        </div>
      </div>
    </div>
  );
}
