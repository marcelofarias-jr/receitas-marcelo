import { Pencil, Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import IconButton from "../UI/IconButton";
import Button from "../UI/Button";
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
          <Button type="button" size="sm" onClick={onNew}>
            <Plus size={16} aria-hidden="true" />
            Nova receita
          </Button>
        </div>
      </div>
      <div className={styles.recipeList}>
        {isFetchingRecipes
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonRow} aria-hidden="true">
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonActions}>
                  <div className={styles.skeletonIcon} />
                  <div className={styles.skeletonIcon} />
                  <div className={styles.skeletonIcon} />
                </div>
              </div>
            ))
          : recipes.map((recipe) => (
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
                  />{" "}
                  <Link
                    href={`/receitas/${recipe.slug}`}
                    target="_blank"
                    className={styles.viewButton}
                    aria-label="Ver receita publicada"
                    title="Ver receita publicada"
                  >
                    <ExternalLink size={16} />
                  </Link>{" "}
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
