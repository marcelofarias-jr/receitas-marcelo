import { Pencil, Plus, Trash2 } from "lucide-react";
import IconButton from "../UI/IconButton";
import LoadingButton from "../UI/LoadingButton";
import styles from "./RecipeListPanel.module.scss";
import type { Recipe } from "../../types/recipes";

type RecipeListPanelProps = {
  recipes: Recipe[];
  selectedSlug: string | null;
  isFetchingRecipes: boolean;
  isSubmitting: boolean;
  onNew: () => void;
  onEdit: (recipe: Recipe) => void;
  onRequestDelete: (slug: string) => void;
};

export default function RecipeListPanel({
  recipes,
  selectedSlug,
  isFetchingRecipes,
  isSubmitting,
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
          <LoadingButton
            type="button"
            isLoading={false}
            onClick={onNew}
            className={styles.newButton}
          >
            <Plus size={16} aria-hidden="true" />
            Nova receita
          </LoadingButton>
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
              <IconButton
                icon={<Pencil size={16} />}
                onClick={() => onEdit(recipe)}
                disabled={isSubmitting}
                aria-label="Editar receita"
                title="Editar receita"
              />
              <IconButton
                icon={<Trash2 size={16} />}
                isDanger
                onClick={() => onRequestDelete(recipe.slug)}
                disabled={isSubmitting}
                aria-label="Excluir receita"
                title="Excluir receita"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
