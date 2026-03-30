"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./page.module.scss";
import AdminAuthCard from "../../components/AdminAuthCard/AdminAuthCard";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import RecipeListPanel from "../../components/RecipeListPanel/RecipeListPanel";
import type { AdminFormValues } from "../../types/admin";
import type { Recipe, RecipesData } from "../../types/recipes";
import RecipeFormPanel from "@/components/RecipeFormPanel/RecipeFormPanel";
import { toast, ToastContainer } from "react-toastify";

const emptyForm: AdminFormValues = {
  titulo: "",
  resumo: "",
  tipo: "",
  tempoDePreparo: "",
  rendimento: "",
  fotoUrl: "",
  culinariaText: "",
  ingredientesText: "",
  preparoText: "",
  vegano: false,
};

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toLineText(values: string[]) {
  return values.join("\n");
}

function parseNumber(value: string) {
  const match = value.match(/\d+/g);
  return match ? match.join("") : "";
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  //const [message, setMessage] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({
    defaultValues: emptyForm,
    mode: "onBlur",
  });

  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.slug === selectedSlug) ?? null,
    [recipes, selectedSlug],
  );

  const availableTypes = useMemo(() => {
    const types = new Set(recipes.map((recipe) => recipe.tipo).filter(Boolean));
    return Array.from(types).sort();
  }, [recipes]);

  const fetchRecipes = useCallback(async () => {
    setIsFetchingRecipes(true);
    const response = await fetch("/api/receitas", {
      cache: "no-store",
      credentials: "include",
    });
    const data = (await response.json()) as RecipesData;
    setRecipes((data.receitas ?? []).filter((recipe) => !recipe.deleted));
    setIsFetchingRecipes(false);
  }, []);

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/api/admin/me", { cache: "no-store" });
      const data = (await response.json()) as { ok: boolean };
      setAuthed(data.ok);
      if (data.ok) {
        await fetchRecipes();
      }
    };

    void run();
  }, [fetchRecipes]);

  useEffect(() => {
    if (activeRecipe) {
      reset({
        titulo: activeRecipe.titulo,
        resumo: activeRecipe.resumo,
        tipo: activeRecipe.tipo,
        tempoDePreparo: parseNumber(activeRecipe.tempoDePreparo),
        rendimento: parseNumber(activeRecipe.rendimento),
        fotoUrl: activeRecipe.foto.startsWith("/uploads/") ? "" : activeRecipe.foto,
        culinariaText: toLineText(activeRecipe["culinária"]),
        ingredientesText: toLineText(activeRecipe.igredientes),
        preparoText: toLineText(activeRecipe.preparo),
        vegano: activeRecipe.vegano,
      });
      return;
    }

    reset(emptyForm);
  }, [activeRecipe, reset]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);

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
    setIsLoggingIn(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    let foto = values.fotoUrl.trim();
    const file = values.fotoFile?.[0];

    if (file) {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!uploadResponse.ok) {
        toast.error("Nao foi possivel enviar a imagem.");
        setIsUploadingImage(false);
        return;
      }

      const uploadData = (await uploadResponse.json()) as { url: string };
      foto = uploadData.url;
      setIsUploadingImage(false);
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
      igredientes: toLines(values.ingredientesText),
      preparo: toLines(values.preparoText),
      culinária: toLines(values.culinariaText),
    };

    const isEdit = Boolean(selectedRecipe);
    const url = isEdit
      ? `/api/receitas/${selectedRecipe?.slug}`
      : "/api/receitas";
    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      toast.error("Nao foi possivel salvar a receita.");
      return;
    }

    await fetchRecipes();
    setSelectedSlug(null);
    reset(emptyForm);
    toast.success("Receita salva com sucesso.");
  });

  const handleDeleteBySlug = async (slug: string) => {
    const response = await fetch(`/api/receitas/${slug}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      toast.error("Nao foi possivel excluir a receita.");
      return;
    }

    await fetchRecipes();
    if (selectedSlug === slug) {
      setSelectedSlug(null);
    }
    toast.success("Receita excluida.");
    setPendingDelete(null);
  };

  const handleNew = () => {
    reset();
    setSelectedSlug(null);
    setActiveRecipe(null);
    reset(emptyForm);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/admin/login", {
      method: "DELETE",
      credentials: "include",
    });
    setAuthed(false);
    setRecipes([]);
    setSelectedSlug(null);
    setActiveRecipe(null);
    reset(emptyForm);
    setIsLoggingOut(false);
  };

  const handleEdit = (recipe: Recipe) => {
    setSelectedSlug(recipe.slug);
    setIsLoadingRecipe(true);

    const nextRecipe: Recipe = {
      ...recipe,
      igredientes: [...recipe.igredientes],
      preparo: [...recipe.preparo],
      culinária: [...recipe["culinária"]],
    };

    reset({
      titulo: nextRecipe.titulo,
      resumo: nextRecipe.resumo,
      tipo: nextRecipe.tipo,
      tempoDePreparo: parseNumber(nextRecipe.tempoDePreparo),
      rendimento: parseNumber(nextRecipe.rendimento),
      fotoUrl: nextRecipe.foto.startsWith("/uploads/") ? "" : nextRecipe.foto,
      culinariaText: toLineText(nextRecipe["culinária"]),
      ingredientesText: toLineText(nextRecipe.igredientes),
      preparoText: toLineText(nextRecipe.preparo),
      vegano: nextRecipe.vegano,
    });

    setActiveRecipe(nextRecipe);

    window.setTimeout(() => {
      setIsLoadingRecipe(false);
    }, 150);
  };

  if (!authed) {
    return (
      <div className={styles.page}>
        <AdminAuthCard
          username={username}
          password={password}
          isLoggingIn={isLoggingIn}
          //styles={styles}
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
            <RecipeListPanel
              recipes={recipes}
              selectedSlug={selectedSlug}
              isFetchingRecipes={isFetchingRecipes}
              isLoadingRecipe={isLoadingRecipe}
              onNew={handleNew}
              onEdit={handleEdit}
              onRequestDelete={setPendingDelete}
            />
            <button
              className={styles.logoutButton}
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Saindo..." : "Sair"}
            </button>
          </div>
          <RecipeFormPanel
            selectedRecipe={selectedRecipe}
            isLoadingRecipe={isLoadingRecipe}
            isSubmitting={isSubmitting}
            isUploadingImage={isUploadingImage}
            register={register}
            setValue={setValue}
            errors={errors}
            onSubmit={onSubmit}
            availableTypes={availableTypes}
            // onRequestDelete={() => {
            //   if (selectedRecipe) {
            //     setPendingDelete(selectedRecipe.slug);
            //   }
            // }}
          />
        </main>
        <DeleteModal
          isOpen={Boolean(pendingDelete)}
          isSubmitting={isSubmitting}
          //styles={styles}
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
