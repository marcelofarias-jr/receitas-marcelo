"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./page.module.scss";
import Button from "../../components/UI/Button";
import AdminAuthCard from "../../components/AdminAuthCard";
import DeleteModal from "../../components/DeleteModal";
import RecipeListPanel from "../../components/RecipeListPanel";
import type { Recipe, RecipesData } from "../../types/recipes";
import RecipeFormPanel from "@/components/RecipeFormPanel";
import { toast, ToastContainer } from "react-toastify";
import {
  recipeFormSchema,
  type RecipeFormValues,
} from "../../schemas/recipe.schema";

const emptyForm: RecipeFormValues = {
  titulo: "",
  resumo: "",
  tipo: "",
  tempoDePreparo: "",
  rendimento: "",
  fotoUrl: "",
  fotoFile: undefined,
  culinariaText: "",
  ingredientesText: "",
  preparoText: "",
  vegano: false,
  publicada: false,
};

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toLineText(values: string[]): string {
  return values.join("\n");
}

function parseNumber(value: string): string {
  const match = value.match(/\d+/g);
  return match ? match.join("") : "";
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const methods = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: emptyForm,
    mode: "onChange",
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.slug === selectedSlug) ?? null,
    [recipes, selectedSlug],
  );

  const availableTypes = useMemo(() => {
    const types = new Set(recipes.map((recipe) => recipe.tipo).filter(Boolean));
    return Array.from(types).sort();
  }, [recipes]);

  const fetchRecipes = useCallback(async (): Promise<void> => {
    setIsFetchingRecipes(true);
    try {
      const response = await fetch("/api/admin/receitas", {
        cache: "no-store",
        credentials: "include",
      });
      const data = (await response.json()) as RecipesData;
      setRecipes((data.receitas ?? []).filter((recipe) => !recipe.deleted));
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
      toast.error("Erro ao carregar receitas");
    } finally {
      setIsFetchingRecipes(false);
    }
  }, []);

  // Reset form when selected recipe changes
  useEffect(() => {
    if (selectedRecipe) {
      reset({
        titulo: selectedRecipe.titulo,
        resumo: selectedRecipe.resumo,
        tipo: selectedRecipe.tipo,
        tempoDePreparo: parseNumber(selectedRecipe.tempoDePreparo),
        rendimento: parseNumber(selectedRecipe.rendimento),
        fotoUrl: selectedRecipe.foto.startsWith("/uploads/")
          ? ""
          : selectedRecipe.foto,
        fotoFile: undefined,
        culinariaText: toLineText(selectedRecipe["culinária"]),
        ingredientesText: toLineText(selectedRecipe.igredientes),
        preparoText: toLineText(selectedRecipe.preparo),
        vegano: selectedRecipe.vegano,
        publicada: selectedRecipe.publicada,
      });
    } else {
      reset(emptyForm);
    }
  }, [selectedRecipe, reset]);

  useEffect(() => {
    const run = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/me", { cache: "no-store" });
        const data = (await response.json()) as { ok: boolean };
        setAuthed(data.ok);
        if (data.ok) {
          await fetchRecipes();
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setAuthed(false);
      }
    };

    void run();
  }, [fetchRecipes]);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        toast.error("Senha incorreta.");
        setIsLoggingIn(false);
        return;
      }

      setAuthed(true);
      await fetchRecipes();
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao realizar login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onSubmit = async (values: RecipeFormValues): Promise<void> => {
    console.log("SUBMIT - Current form values:", values);

    let foto = values.fotoUrl?.trim() || "";
    const file = values.fotoFile?.[0];

    if (file) {
      setIsUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!uploadResponse.ok) {
          toast.error("Não foi possível enviar a imagem.");
          setIsUploadingImage(false);
          return;
        }

        const uploadData = (await uploadResponse.json()) as { url: string };
        foto = uploadData.url;
      } catch (error) {
        console.error("Erro no upload:", error);
        toast.error("Erro no upload da imagem");
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    if (!foto && selectedRecipe?.foto) {
      foto = selectedRecipe.foto;
    }

    if (!foto) {
      toast.error("Informe uma imagem (upload ou URL).");
      return;
    }

    const payload: Partial<Recipe> = {
      titulo: values.titulo,
      resumo: values.resumo,
      tipo: values.tipo,
      tempoDePreparo: `${values.tempoDePreparo} minutos`,
      rendimento: `${values.rendimento} porcoes`,
      foto,
      vegano: values.vegano,
      publicada: values.publicada ?? false,
      igredientes: toLines(values.ingredientesText),
      preparo: toLines(values.preparoText),
      culinária: toLines(values.culinariaText || ""),
    };

    const isEdit = Boolean(selectedRecipe);
    const url = isEdit
      ? `/api/receitas/${selectedRecipe?.slug}`
      : "/api/receitas";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast.error("Não foi possível salvar a receita.");
        return;
      }

      const savedRecipe = (await response.json()) as Recipe;
      await fetchRecipes();

      if (isEdit) {
        setSelectedSlug(savedRecipe.slug);
      } else {
        setSelectedSlug(null);
        reset(emptyForm);
      }

      toast.success("Receita salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      toast.error("Erro ao salvar receita");
    }
  };

  const handleDeleteBySlug = async (slug: string): Promise<void> => {
    try {
      const response = await fetch(`/api/receitas/${slug}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Não foi possível excluir a receita.");
        return;
      }

      await fetchRecipes();
      if (selectedSlug === slug) {
        setSelectedSlug(null);
      }
      toast.success("Receita excluída.");
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
      toast.error("Erro ao excluir receita");
    } finally {
      setPendingDelete(null);
    }
  };

  const handleNew = (): void => {
    setSelectedSlug(null);
  };

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/login", {
        method: "DELETE",
        credentials: "include",
      });
      setAuthed(false);
      setRecipes([]);
      setSelectedSlug(null);
      reset(emptyForm);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEdit = (recipe: Recipe): void => {
    setSelectedSlug(recipe.slug);
  };

  if (!authed) {
    return (
      <div className={styles.page}>
        <AdminAuthCard
          username={username}
          password={password}
          isLoggingIn={isLoggingIn}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className={styles.page}>
        <main className={styles.layout}>
          <div className={styles.sidebar}>
            <Link href="/" className={styles.navLink}>
              ← Ver receitas
            </Link>
            <RecipeListPanel
              recipes={recipes}
              selectedSlug={selectedSlug}
              isFetchingRecipes={isFetchingRecipes}
              isSubmitting={isSubmitting}
              onNew={handleNew}
              onEdit={handleEdit}
              onRequestDelete={setPendingDelete}
            />
            <Button
              variant="danger"
              fullWidth
              onClick={() => void handleLogout()}
              isLoading={isLoggingOut}
              loadingText="Saindo..."
            >
              Sair
            </Button>
          </div>
          <FormProvider {...methods}>
            <RecipeFormPanel
              key={selectedSlug ?? "new"}
              selectedRecipe={selectedRecipe}
              isSubmitting={isSubmitting}
              isUploadingImage={isUploadingImage}
              onSubmit={methods.handleSubmit(onSubmit)}
              availableTypes={availableTypes}
            />
          </FormProvider>
        </main>
        <DeleteModal
          isOpen={Boolean(pendingDelete)}
          isSubmitting={isSubmitting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            if (pendingDelete) {
              void handleDeleteBySlug(pendingDelete);
            }
          }}
        />
      </div>
    </>
  );
}
