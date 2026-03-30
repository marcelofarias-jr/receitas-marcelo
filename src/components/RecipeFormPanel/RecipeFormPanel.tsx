import { type BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import Image from "next/image";
import styles from "./RecipeFormPanel.module.scss";
import type { Recipe } from "../../types/recipes";
import type { AdminFormValues } from "../../types/admin";

type RecipeFormPanelProps = {
  selectedRecipe: Recipe | null;
  isLoadingRecipe: boolean;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  register: UseFormRegister<AdminFormValues>;
  setValue: UseFormSetValue<AdminFormValues>;
  errors: FieldErrors<AdminFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  availableTypes: string[];
};

export default function RecipeFormPanel({
  selectedRecipe,
  isLoadingRecipe,
  isSubmitting,
  isUploadingImage,
  register,
  setValue,
  errors,
  onSubmit,
  availableTypes,
}: RecipeFormPanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(
    selectedRecipe?.foto ?? "",
  );
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(selectedRecipe?.foto ?? "");
  }, [selectedRecipe]);

  const currentUploadName = selectedRecipe?.foto?.startsWith("/uploads/")
    ? selectedRecipe.foto.split("/").pop()
    : null;

  const fotoFileProps = register("fotoFile");
  const fotoUrlProps = register("fotoUrl");
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
        <div className={styles.field}>
          <label>Tipo</label>
          <div className={styles.typeInputWrapper}>
            <input
              {...register("tipo", {
                required: "Informe o tipo da receita.",
              })}
              list="tipos-list"
              placeholder="Selecione um tipo existente ou digite um novo"
              className={styles.typeInput}
            />
            <datalist id="tipos-list">
              {availableTypes.map((type) => (
                <option key={type} value={type} />
              ))}
            </datalist>
          </div>
          {errors.tipo ? (
            <span className={styles.errorText}>{errors.tipo.message}</span>
          ) : null}
        </div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Tempo de preparo (minutos)</label>
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
            <label>Rendimento (porções)</label>
            <input
              type="number"
              min={1}
              step={1}
              {...register("rendimento", {
                required: "Informe o rendimento.",
              })}
            />
            {errors.rendimento ? (
              <span className={styles.errorText}>
                {errors.rendimento.message}
              </span>
            ) : null}
          </div>
        </div>
        <div className={styles.imageSection}>
          {previewUrl ? (
            <div className={styles.imagePreview}>
              <Image
                src={previewUrl}
                alt="Pré-visualização"
                fill
                sizes="340px"
                style={{ objectFit: "cover" }}
                unoptimized={previewUrl.startsWith("blob:")}
              />
            </div>
          ) : (
            <div className={styles.imagePreviewPlaceholder}>
              <span>Sem imagem</span>
            </div>
          )}
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Imagem (upload)</label>
              <input
                type="file"
                accept="image/*"
                {...fotoFileProps}
                ref={(el) => {
                  fotoFileProps.ref(el);
                  fileInputRef.current = el;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (objectUrlRef.current) {
                      URL.revokeObjectURL(objectUrlRef.current);
                    }
                    const url = URL.createObjectURL(file);
                    objectUrlRef.current = url;
                    setPreviewUrl(url);
                    setValue("fotoUrl", "");
                  }
                  void fotoFileProps.onChange(e);
                }}
              />
              {currentUploadName ? (
                <span className={styles.currentFile}>
                  Atual: {currentUploadName}
                </span>
              ) : null}
            </div>
            <div className={styles.field}>
              <label>Imagem (URL)</label>
              <input
                placeholder="https://"
                {...fotoUrlProps}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  if (val) {
                    if (objectUrlRef.current) {
                      URL.revokeObjectURL(objectUrlRef.current);
                      objectUrlRef.current = null;
                    }
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    setPreviewUrl(val);
                  }
                  void fotoUrlProps.onChange(e);
                }}
              />
            </div>
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
