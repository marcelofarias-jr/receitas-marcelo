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
  fotoFile: undefined,
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({
    defaultValues: emptyForm,
    mode: "onChange",
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

  // Efeito para resetar o formulário quando a receita selecionada muda
  useEffect(() => {
    if (selectedRecipe) {
      // Reset com os valores da receita selecionada
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
      });
    } else {
      // Reset para formulário vazio
      reset(emptyForm);
    }
  }, [selectedRecipe, reset]);

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
    console.log("Valores do formulário ao salvar:", values); // Debug

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

    const savedRecipe = (await response.json()) as Recipe;
    await fetchRecipes();

    if (isEdit) {
      // Atualiza a receita selecionada com os novos dados
      setSelectedSlug(savedRecipe.slug);
      // O useEffect vai resetar o formulário com os novos valores
    } else {
      setSelectedSlug(null);
      reset(emptyForm);
    }
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
    setSelectedSlug(null);
    // O useEffect vai resetar para emptyForm automaticamente
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
    reset(emptyForm);
    setIsLoggingOut(false);
  };

  const handleEdit = (recipe: Recipe) => {
    setSelectedSlug(recipe.slug);
    // O useEffect vai resetar o formulário com os valores da receita
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
            <RecipeListPanel
              recipes={recipes}
              selectedSlug={selectedSlug}
              isFetchingRecipes={isFetchingRecipes}
              isSubmitting={isSubmitting}
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
            key={selectedSlug ?? "new"}
            selectedRecipe={selectedRecipe}
            isSubmitting={isSubmitting}
            isUploadingImage={isUploadingImage}
            register={register}
            setValue={setValue}
            watch={watch}
            control={control}
            errors={errors}
            onSubmit={onSubmit}
            availableTypes={availableTypes}
          />
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
