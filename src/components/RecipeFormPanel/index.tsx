"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import LoadingButton from "../UI/LoadingButton";
import styles from "./RecipeFormPanel.module.scss";
import type { Recipe } from "../../types/recipes";
import type { RecipeFormValues } from "../../schemas/recipe.schema";

interface RecipeFormPanelProps {
  selectedRecipe: Recipe | null;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  availableTypes: string[];
}

// Helper function for safe object URL revocation
const revokeObjectUrlSafe = (
  urlRef: React.MutableRefObject<string | null>,
): void => {
  if (urlRef.current) {
    URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
  }
};

export default function RecipeFormPanel({
  selectedRecipe,
  isSubmitting,
  isUploadingImage,
  onSubmit,
  availableTypes,
}: RecipeFormPanelProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  const fotoUrl = watch("fotoUrl");
  const fotoFile = watch("fotoFile");

  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Cleanup function
  const cleanupObjectUrl = useCallback((): void => {
    revokeObjectUrlSafe(objectUrlRef);
  }, []);

  // Update preview from file
  const updatePreviewFromFile = useCallback(
    (file: File): void => {
      cleanupObjectUrl();
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    },
    [cleanupObjectUrl],
  );

  // Update preview from URL string
  const updatePreviewFromUrl = useCallback(
    (url: string): void => {
      cleanupObjectUrl();
      setPreviewUrl(url);
    },
    [cleanupObjectUrl],
  );

  // Effect ONLY for cleanup and initial sync when selected recipe changes
  useEffect(() => {
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clean up old object URL
    cleanupObjectUrl();

    // Update preview based on selected recipe
    const newPreviewUrl = selectedRecipe?.foto ?? "";
    setPreviewUrl(newPreviewUrl);

    // Cleanup on unmount
    return cleanupObjectUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecipe]); // Only depend on selectedRecipe

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0] ?? null;
      if (file) {
        setValue("fotoUrl", "");
        setValue("fotoFile", e.target.files);
        updatePreviewFromFile(file);
      } else {
        setValue("fotoFile", undefined);
        // Reset preview to selected recipe if no file
        const newPreviewUrl = selectedRecipe?.foto ?? "";
        setPreviewUrl(newPreviewUrl);
      }
    },
    [setValue, updatePreviewFromFile, selectedRecipe],
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const val = e.target.value.trim();
      if (val) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setValue("fotoFile", undefined);
        setValue("fotoUrl", val);
        updatePreviewFromUrl(val);
      } else {
        setValue("fotoUrl", "");
        // Reset preview to selected recipe if URL is cleared
        const newPreviewUrl = selectedRecipe?.foto ?? "";
        setPreviewUrl(newPreviewUrl);
      }
    },
    [setValue, updatePreviewFromUrl, selectedRecipe],
  );

  const currentUploadName = selectedRecipe?.foto?.startsWith("/uploads/")
    ? selectedRecipe.foto.split("/").pop()
    : null;

  const showCurrentFile =
    currentUploadName !== null &&
    (!fotoFile || fotoFile.length === 0) &&
    (!fotoUrl || fotoUrl.trim() === "");

  return (
    <section className={styles.formPanel}>
      <div className={styles.panelHeader}>
        <h2>{selectedRecipe ? "Editar receita" : "Nova receita"}</h2>
        <p>Preencha os campos e salve.</p>
      </div>
      <form onSubmit={onSubmit} className={styles.form} noValidate>
        {/* Título */}
        <div className={styles.field}>
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            {...register("titulo")}
            aria-invalid={!!errors.titulo}
          />
          {errors.titulo && (
            <span className={styles.errorText} role="alert">
              {errors.titulo.message}
            </span>
          )}
        </div>

        {/* Resumo */}
        <div className={styles.field}>
          <label htmlFor="resumo">Resumo</label>
          <textarea
            id="resumo"
            rows={3}
            {...register("resumo")}
            aria-invalid={!!errors.resumo}
          />
          {errors.resumo && (
            <span className={styles.errorText} role="alert">
              {errors.resumo.message}
            </span>
          )}
        </div>

        {/* Tipo */}
        <div className={styles.field}>
          <label htmlFor="tipo">Tipo</label>
          <div className={styles.typeInputWrapper}>
            <input
              id="tipo"
              {...register("tipo")}
              list="tipos-list"
              placeholder="Selecione um tipo existente ou digite um novo"
              className={styles.typeInput}
              aria-invalid={!!errors.tipo}
            />
            <datalist id="tipos-list">
              {availableTypes.map((type) => (
                <option key={type} value={type} />
              ))}
            </datalist>
          </div>
          {errors.tipo && (
            <span className={styles.errorText} role="alert">
              {errors.tipo.message}
            </span>
          )}
        </div>

        {/* Tempo e Rendimento */}
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="tempoDePreparo">Tempo de preparo (minutos)</label>
            <div className={styles.inputWithSuffix}>
              <input
                id="tempoDePreparo"
                type="number"
                min={1}
                step={1}
                {...register("tempoDePreparo")}
                aria-invalid={!!errors.tempoDePreparo}
              />
              <span>min</span>
            </div>
            {errors.tempoDePreparo && (
              <span className={styles.errorText} role="alert">
                {errors.tempoDePreparo.message}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="rendimento">Rendimento (porções)</label>
            <input
              id="rendimento"
              type="number"
              min={1}
              step={1}
              {...register("rendimento")}
              aria-invalid={!!errors.rendimento}
            />
            {errors.rendimento && (
              <span className={styles.errorText} role="alert">
                {errors.rendimento.message}
              </span>
            )}
          </div>
        </div>

        {/* Imagem */}
        <div className={styles.imageSection}>
          {previewUrl ? (
            <div className={styles.imagePreview}>
              <Image
                src={previewUrl}
                alt="Pré-visualização"
                fill
                sizes="340px"
                style={{ objectFit: "cover" }}
                unoptimized={
                  previewUrl.startsWith("blob:") ||
                  previewUrl.startsWith("/uploads/")
                }
              />
            </div>
          ) : (
            <div className={styles.imagePreviewPlaceholder}>
              <span>Sem imagem</span>
            </div>
          )}

          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="fotoFile">Imagem (upload)</label>
              <input
                id="fotoFile"
                type="file"
                accept="image/*"
                ref={(el) => {
                  register("fotoFile").ref(el);
                  fileInputRef.current = el;
                }}
                onChange={handleFileChange}
              />
              {showCurrentFile && (
                <span className={styles.currentFile}>
                  Atual: {currentUploadName}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="fotoUrl">Imagem (URL)</label>
              <input
                id="fotoUrl"
                type="url"
                placeholder="https://"
                value={fotoUrl ?? ""}
                onChange={handleUrlChange}
              />
            </div>
          </div>
        </div>

        {/* Culinária */}
        <div className={styles.field}>
          <label htmlFor="culinariaText">Culinária (uma por linha)</label>
          <textarea
            id="culinariaText"
            rows={2}
            {...register("culinariaText")}
          />
        </div>

        {/* Ingredientes */}
        <div className={styles.field}>
          <label htmlFor="ingredientesText">Ingredientes (um por linha)</label>
          <textarea
            id="ingredientesText"
            rows={5}
            {...register("ingredientesText")}
            aria-invalid={!!errors.ingredientesText}
          />
          {errors.ingredientesText && (
            <span className={styles.errorText} role="alert">
              {errors.ingredientesText.message}
            </span>
          )}
        </div>

        {/* Preparo */}
        <div className={styles.field}>
          <label htmlFor="preparoText">
            Modo de preparo (um passo por linha)
          </label>
          <textarea
            id="preparoText"
            rows={5}
            {...register("preparoText")}
            aria-invalid={!!errors.preparoText}
          />
          {errors.preparoText && (
            <span className={styles.errorText} role="alert">
              {errors.preparoText.message}
            </span>
          )}
        </div>

        {/* Vegano */}
        <div className={styles.switches}>
          <label>
            <input type="checkbox" {...register("vegano")} />
            Vegano
          </label>
        </div>

        {/* Submit Button */}
        <div className={styles.actions}>
          <LoadingButton
            type="submit"
            isLoading={isSubmitting || isUploadingImage}
            loadingText="Salvando..."
          >
            Salvar
          </LoadingButton>
        </div>
      </form>
    </section>
  );
}
