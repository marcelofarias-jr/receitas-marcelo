import styles from "./RecipeHeader.module.scss";
import CategoryTag from "../UI/CategoryTag";
import MetaInfo from "../UI/MetaInfo";
import RecipeImage from "../UI/RecipeImage";
import type { Recipe } from "../../types/recipes";

type RecipeHeaderProps = {
  recipe: Recipe;
  imageUrl: string;
};

export default function RecipeHeader({ recipe, imageUrl }: RecipeHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <CategoryTag label={recipe.tipo} />
        <h1>{recipe.titulo}</h1>
        <p className={styles.summary}>{recipe.resumo}</p>
        <MetaInfo
          items={[
            recipe.tempoDePreparo,
            recipe.rendimento,
            recipe.vegano ? "Vegano" : "Tradicional",
          ]}
        />
      </div>
      <div className={styles.headerImage}>
        <RecipeImage
          src={imageUrl}
          alt={recipe.titulo}
          width={720}
          height={520}
          sizes="(max-width: 1024px) 95vw, 540px"
          priority
        />
      </div>
    </header>
  );
}
