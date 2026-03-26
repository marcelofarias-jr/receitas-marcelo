import { Pencil, Plus, Trash2 } from "lucide-react";
import styles from "./RecipeListPanel.module.scss";
import type { Recipe } from "../../types/recipes";

type RecipeListPanelProps = {
  recipes: Recipe[];
  selectedSlug: string | null;
  isFetchingRecipes: boolean;
  isLoadingRecipe: boolean;
  onNew: () => void;
  onEdit: (recipe: Recipe) => void;
  onRequestDelete: (slug: string) => void;
};

export default function RecipeListPanel({
  recipes,
  selectedSlug,
  isFetchingRecipes,
  isLoadingRecipe,
  onNew,
  onEdit,
  onRequestDelete,
}: RecipeListPanelProps) {
  return (
    <section className={styles.listPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.listHeader}>
          <div>
            <h1>Receitas</h1>
            <p>Selecione uma receita para editar.</p>
          </div>
          <button type="button" className={styles.newButton} onClick={onNew}>
            <Plus size={16} aria-hidden="true" />
            Nova receita
          </button>
        </div>
      </div>
      <div className={styles.recipeList}>
        {isFetchingRecipes ? (
          <p className={styles.loadingText}>Carregando receitas...</p>
        ) : null}
        {recipes.map((recipe) => (
          <div
            key={recipe.slug}
            className={`${styles.recipeRow} ${
              recipe.slug === selectedSlug ? styles.recipeItemActive : ""
            }`}
          >
            <strong>{recipe.titulo}</strong>
            <div className={styles.recipeActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => onEdit(recipe)}
                aria-label="Editar receita"
                title="Editar receita"
                disabled={isLoadingRecipe}
              >
                <Pencil size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.dangerButton}`}
                onClick={() => onRequestDelete(recipe.slug)}
                aria-label="Excluir receita"
                title="Excluir receita"
                disabled={isLoadingRecipe}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
