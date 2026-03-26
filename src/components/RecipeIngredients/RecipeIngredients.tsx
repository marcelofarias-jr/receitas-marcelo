import styles from "./RecipeIngredients.module.scss";

type RecipeIngredientsProps = {
  recipeId: number;
  items: string[];
};

export default function RecipeIngredients({
  recipeId,
  items,
}: RecipeIngredientsProps) {
  return (
    <section className={styles.section}>
      <h2>Ingredientes</h2>
      <ul>
        {items.map((item, index) => (
          <li key={`${recipeId}-ing-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
