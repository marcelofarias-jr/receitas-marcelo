import type { BaseSyntheticEvent } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import styles from "./RecipeFormPanel.module.scss";
import type { Recipe } from "../../types/recipes";
import type { AdminFormValues } from "../../types/admin";

type RecipeFormPanelProps = {
  selectedRecipe: Recipe | null;
  isLoadingRecipe: boolean;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  register: UseFormRegister<AdminFormValues>;
  errors: FieldErrors<AdminFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  //onRequestDelete: () => void;
};

export default function RecipeFormPanel({
  selectedRecipe,
  isLoadingRecipe,
  isSubmitting,
  isUploadingImage,
  register,
  errors,
  onSubmit,
  //onRequestDelete,
}: RecipeFormPanelProps) {
  if (isLoadingRecipe) {
    return (
      <section className={styles.formPanel}>
        <div className={styles.panelHeader}>
          <h2>{selectedRecipe ? "Editar receita" : "Nova receita"}</h2>
          <p>Preencha os campos e salve.</p>
        </div>
        <div className={styles.formSpinner} aria-busy="true">
          <span className={styles.spinner} />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.formPanel}>
      <div className={styles.panelHeader}>
        <h2>{selectedRecipe ? "Editar receita" : "Nova receita"}</h2>
        <p>Preencha os campos e salve.</p>
      </div>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Titulo</label>
          <input
            {...register("titulo", {
              required: "Informe o titulo da receita.",
            })}
          />
          {errors.titulo ? (
            <span className={styles.errorText}>{errors.titulo.message}</span>
          ) : null}
        </div>
        <div className={styles.field}>
          <label>Resumo</label>
          <textarea
            rows={3}
            {...register("resumo", {
              required: "Informe um resumo curto.",
            })}
          />
          {errors.resumo ? (
            <span className={styles.errorText}>{errors.resumo.message}</span>
          ) : null}
        </div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Tipo</label>
            <input
              {...register("tipo", {
                required: "Informe o tipo da receita.",
              })}
            />
            {errors.tipo ? (
              <span className={styles.errorText}>{errors.tipo.message}</span>
            ) : null}
          </div>
          <div className={styles.field}>
            <label>Tempo de preparo (em minutos)</label>
            <div className={styles.inputWithSuffix}>
              <input
                type="number"
                min={1}
                step={1}
                {...register("tempoDePreparo", {
                  required: "Informe o tempo de preparo.",
                })}
              />
              <span>min</span>
            </div>
            {errors.tempoDePreparo ? (
              <span className={styles.errorText}>
                {errors.tempoDePreparo.message}
              </span>
            ) : null}
          </div>
          <div className={styles.field}>
            <label>Rendimento (porcoes)</label>
            <div className={styles.inputWithSuffix}>
              <input
                type="number"
                min={1}
                step={1}
                {...register("rendimento", {
                  required: "Informe o rendimento.",
                })}
              />
            </div>
            {errors.rendimento ? (
              <span className={styles.errorText}>
                {errors.rendimento.message}
              </span>
            ) : null}
          </div>
          <div className={styles.field}>
            <label>Imagem (upload)</label>
            <input type="file" accept="image/*" {...register("fotoFile")} />
          </div>
          <div className={styles.field}>
            <label>Imagem (URL)</label>
            <input placeholder="https://" {...register("fotoUrl")} />
          </div>
        </div>
        <div className={styles.field}>
          <label>Culinaria (uma por linha)</label>
          <textarea rows={2} {...register("culinariaText")} />
        </div>
        <div className={styles.field}>
          <label>Ingredientes (um por linha)</label>
          <textarea
            rows={5}
            {...register("ingredientesText", {
              required: "Informe pelo menos um ingrediente.",
            })}
          />
          {errors.ingredientesText ? (
            <span className={styles.errorText}>
              {errors.ingredientesText.message}
            </span>
          ) : null}
        </div>
        <div className={styles.field}>
          <label>Modo de preparo (um passo por linha)</label>
          <textarea
            rows={5}
            {...register("preparoText", {
              required: "Descreva o modo de preparo.",
            })}
          />
          {errors.preparoText ? (
            <span className={styles.errorText}>
              {errors.preparoText.message}
            </span>
          ) : null}
        </div>
        <div className={styles.switches}>
          <label>
            <input type="checkbox" {...register("vegano")} />
            Vegano
          </label>
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={isSubmitting || isUploadingImage}>
            {isSubmitting || isUploadingImage ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}
