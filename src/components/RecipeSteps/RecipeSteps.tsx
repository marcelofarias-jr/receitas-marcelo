import styles from "./RecipeSteps.module.scss";

type RecipeStepsProps = {
  recipeId: number;
  steps: string[];
};

export default function RecipeSteps({ recipeId, steps }: RecipeStepsProps) {
  return (
    <section className={styles.section}>
      <h2>Modo de preparo</h2>
      <ol>
        {steps.map((step, index) => (
          <li key={`${recipeId}-step-${index}`}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
