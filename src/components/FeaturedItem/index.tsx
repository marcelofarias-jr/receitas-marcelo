import Link from "next/link";
import styles from "./FeaturedItem.module.scss";
import CategoryTag from "../UI/CategoryTag";
import RecipeImage from "../UI/RecipeImage";
import type { Recipe } from "../../types/recipes";

type FeaturedItemProps = {
  recipe: Recipe;
  imageUrl: string;
};

export default function FeaturedItem({ recipe, imageUrl }: FeaturedItemProps) {
  return (
    <Link href={`/receitas/${recipe.slug}`} className={styles.featuredCard}>
      <div className={styles.featuredThumb}>
        <RecipeImage
          src={imageUrl}
          alt={recipe.titulo}
          width={120}
          height={90}
          sizes="120px"
        />
      </div>
      <div className={styles.featuredBody}>
        <CategoryTag label={recipe.tipo} />
        <h3 className={styles.featuredTitle}>{recipe.titulo}</h3>
        <span className={styles.featuredMeta}>{recipe.tempoDePreparo}</span>
      </div>
    </Link>
  );
}
