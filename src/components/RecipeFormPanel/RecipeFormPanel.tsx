import {
  type BaseSyntheticEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Controller,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
  type Control,
} from "react-hook-form";
import Image from "next/image";
import styles from "./RecipeFormPanel.module.scss";
import type { Recipe } from "../../types/recipes";
import type { AdminFormValues } from "../../types/admin";

interface RecipeFormPanelProps {
  selectedRecipe: Recipe | null;
  isSubmitting: boolean;
  isUploadingImage: boolean;
  register: UseFormRegister<AdminFormValues>;
  setValue: UseFormSetValue<AdminFormValues>;
  watch: UseFormWatch<AdminFormValues>;
  errors: FieldErrors<AdminFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  availableTypes: string[];
  control: Control<AdminFormValues>;
}

export default function RecipeFormPanel({
  selectedRecipe,
  isSubmitting,
  isUploadingImage,
  register,
  setValue,
  watch,
  errors,
  onSubmit,
  availableTypes,
  control,
}: RecipeFormPanelProps) {
  const fotoUrl = watch("fotoUrl");
  const fotoFile = watch("fotoFile");

  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Função para limpar URL de objeto
  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  // Função para atualizar preview a partir de um arquivo
  const updatePreviewFromFile = useCallback(
    (file: File) => {
      revokeObjectUrl();
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    },
    [revokeObjectUrl],
  );

  // Função para atualizar preview a partir de uma URL
  const updatePreviewFromUrl = useCallback(
    (url: string) => {
      revokeObjectUrl();
      setPreviewUrl(url);
    },
    [revokeObjectUrl],
  );

  // Função para resetar o preview baseado na receita selecionada
  const resetPreviewToSelectedRecipe = useCallback(() => {
    revokeObjectUrl();
    if (selectedRecipe?.foto) {
      setPreviewUrl(selectedRecipe.foto);
    } else {
      setPreviewUrl("");
    }
  }, [selectedRecipe, revokeObjectUrl]);

  // Handler para mudança de arquivo
  const handleFileChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (event: any) => void,
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue("fotoUrl", "");
        onChange(e);
        updatePreviewFromFile(file);
      } else {
        setValue("fotoFile", undefined);
        onChange(e);
        resetPreviewToSelectedRecipe();
      }
    },
    [setValue, updatePreviewFromFile, resetPreviewToSelectedRecipe],
  );

  // Handler para mudança de URL
  const handleUrlChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (event: any) => void,
    ) => {
      const val = e.target.value.trim();
      if (val) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setValue("fotoFile", undefined);
        onChange(e);
        updatePreviewFromUrl(val);
      } else {
        setValue("fotoUrl", "");
        onChange(e);
        resetPreviewToSelectedRecipe();
      }
    },
    [setValue, updatePreviewFromUrl, resetPreviewToSelectedRecipe],
  );

  // Efeito apenas para sincronizar com mudanças externas (quando a receita selecionada muda)
  useEffect(() => {
    // Limpa o input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Reseta o preview baseado na receita selecionada
    resetPreviewToSelectedRecipe();

    // Cleanup no unmount
    return () => {
      revokeObjectUrl();
    };
  }, [selectedRecipe, resetPreviewToSelectedRecipe, revokeObjectUrl]);

  const currentUploadName = selectedRecipe?.foto?.startsWith("/uploads/")
    ? selectedRecipe.foto.split("/").pop()
    : null;

  const fotoFileProps = register("fotoFile");
  const fotoUrlProps = register("fotoUrl");

  const showCurrentFile =
    currentUploadName &&
    (!fotoFile || fotoFile.length === 0) &&
    (!fotoUrl || fotoUrl.trim() === "");

  return (
    <section className={styles.formPanel}>
      <div className={styles.panelHeader}>
        <h2>{selectedRecipe ? "Editar receita" : "Nova receita"}</h2>
        <p>Preencha os campos e salve.</p>
      </div>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Título</label>
          <Controller
            name="titulo"
            control={control}
            rules={{ required: "Informe o título da receita." }}
            render={({ field }) => <input {...field} />}
          />
          {errors.titulo ? (
            <span className={styles.errorText}>{errors.titulo.message}</span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label>Resumo</label>
          <Controller
            name="resumo"
            control={control}
            rules={{ required: "Informe um resumo curto." }}
            render={({ field }) => <textarea rows={3} {...field} />}
          />
          {errors.resumo ? (
            <span className={styles.errorText}>{errors.resumo.message}</span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label>Tipo</label>
          <Controller
            name="tipo"
            control={control}
            rules={{ required: "Informe o tipo da receita." }}
            render={({ field }) => (
              <div className={styles.typeInputWrapper}>
                <input
                  {...field}
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
            )}
          />
          {errors.tipo ? (
            <span className={styles.errorText}>{errors.tipo.message}</span>
          ) : null}
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Tempo de preparo (minutos)</label>
            <Controller
              name="tempoDePreparo"
              control={control}
              rules={{ required: "Informe o tempo de preparo." }}
              render={({ field }) => (
                <div className={styles.inputWithSuffix}>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : value);
                    }}
                  />
                  <span>min</span>
                </div>
              )}
            />
            {errors.tempoDePreparo ? (
              <span className={styles.errorText}>
                {errors.tempoDePreparo.message}
              </span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label>Rendimento (porções)</label>
            <Controller
              name="rendimento"
              control={control}
              rules={{ required: "Informe o rendimento." }}
              render={({ field }) => (
                <input
                  type="number"
                  min={1}
                  step={1}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? "" : value);
                  }}
                />
              )}
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
                    setValue("fotoUrl", "");
                    fotoFileProps.onChange(e);
                    updatePreviewFromFile(file);
                  } else {
                    setValue("fotoFile", undefined);
                    fotoFileProps.onChange(e);
                    resetPreviewToSelectedRecipe();
                  }
                }}
              />
              {showCurrentFile && (
                <span className={styles.currentFile}>
                  Atual: {currentUploadName}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label>Imagem (URL)</label>
              <input
                placeholder="https://"
                {...fotoUrlProps}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  if (val) {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    setValue("fotoFile", undefined);
                    fotoUrlProps.onChange(e);
                    updatePreviewFromUrl(val);
                  } else {
                    setValue("fotoUrl", "");
                    fotoUrlProps.onChange(e);
                    resetPreviewToSelectedRecipe();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label>Culinária (uma por linha)</label>
          <Controller
            name="culinariaText"
            control={control}
            render={({ field }) => <textarea rows={2} {...field} />}
          />
        </div>

        <div className={styles.field}>
          <label>Ingredientes (um por linha)</label>
          <Controller
            name="ingredientesText"
            control={control}
            rules={{ required: "Informe pelo menos um ingrediente." }}
            render={({ field }) => <textarea rows={5} {...field} />}
          />
          {errors.ingredientesText ? (
            <span className={styles.errorText}>
              {errors.ingredientesText.message}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label>Modo de preparo (um passo por linha)</label>
          <Controller
            name="preparoText"
            control={control}
            rules={{ required: "Descreva o modo de preparo." }}
            render={({ field }) => <textarea rows={5} {...field} />}
          />
          {errors.preparoText ? (
            <span className={styles.errorText}>
              {errors.preparoText.message}
            </span>
          ) : null}
        </div>

        <div className={styles.switches}>
          <Controller
            name="vegano"
            control={control}
            render={({ field }) => (
              <label>
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                Vegano
              </label>
            )}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className={
              isSubmitting || isUploadingImage
                ? styles.buttonDisabled
                : styles.buttonEnabled
            }
          >
            {isSubmitting || isUploadingImage ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}
