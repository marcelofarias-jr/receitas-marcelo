"use client";

import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "../../app/page.module.scss";
import { useRecipesAccess } from "../../app/state/recipes-context";
import CategoryChip from "../CategoryChip";
import FeaturedItem from "../FeaturedItem";
import HomeHero from "../HomeHero";
import RecipeCard from "../RecipeCard";
import IngredientSearch from "../IngredientSearch";
import SearchBar from "../SearchBar";
import {
  getIngredientMatchCount,
  useRecipeSearch,
} from "../../lib/use-recipe-search";
import type { Recipe, RecipesData } from "../../types/recipes";

const FEATURED_COUNT = 5;
const ALL_CATEGORY = "Todas";
const PAGE_SIZE = 10;

function getImageUrl(recipe: Recipe): string {
  if (recipe.foto.startsWith("http://") || recipe.foto.startsWith("https://")) {
    return recipe.foto;
  }
  if (recipe.foto.startsWith("/uploads/")) {
    return recipe.foto;
  }
  if (
    recipe.foto &&
    !recipe.foto.includes("/") &&
    !recipe.foto.includes("\\")
  ) {
    return `/uploads/${recipe.foto}`;
  }
  return "";
}

type Props = {
  initialRecipes: Recipe[];
};

export default function RecipesClientSection({ initialRecipes }: Props) {
  const { accessById } = useRecipesAccess();
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredientFilters, setIngredientFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const eventSource = new EventSource("/api/updates");
    let controller: AbortController | null = null;

    eventSource.onmessage = () => {
      controller?.abort();
      controller = new AbortController();

      fetch("/api/receitas", { cache: "no-store", signal: controller.signal })
        .then((r) => r.json())
        .then((data: RecipesData) => setRecipes(data.receitas ?? []))
        .catch((error: unknown) => {
          if (error instanceof Error && error.name !== "AbortError") {
            toast.error("Não foi possível atualizar as receitas.");
          }
        });
    };

    return () => {
      controller?.abort();
      eventSource.close();
    };
  }, []);

  const categories = Array.from(new Set(recipes.map((r) => r.tipo)));

  const featuredRecipes = useMemo(() => {
    return [...recipes]
      .sort((a, b) => {
        const aAccess = accessById[a.id] ?? a.acessos ?? 0;
        const bAccess = accessById[b.id] ?? b.acessos ?? 0;
        return bAccess - aAccess;
      })
      .slice(0, FEATURED_COUNT);
  }, [accessById, recipes]);

  const heroRecipe = featuredRecipes[0] ?? recipes[0] ?? null;
  const heroImage = heroRecipe ? getImageUrl(heroRecipe) : "";

  const searchResults = useRecipeSearch(recipes, {
    query: searchQuery,
    ingredients: ingredientFilters,
  });

  const isFiltering =
    searchQuery.trim().length > 0 || ingredientFilters.length > 0;

  const filteredRecipes = useMemo(() => {
    const base = isFiltering ? searchResults : recipes;
    if (activeCategory === ALL_CATEGORY) return base;
    return base.filter((r) => r.tipo === activeCategory);
  }, [activeCategory, recipes, isFiltering, searchResults]);

  const ingredientMatchCount = useMemo(() => {
    if (!ingredientFilters.length) return 0;
    return recipes.filter(
      (r) => getIngredientMatchCount(r, ingredientFilters) > 0,
    ).length;
  }, [recipes, ingredientFilters]);

  const noIngredientResults =
    ingredientFilters.length > 0 && filteredRecipes.length === 0;

  const totalPages = Math.ceil(filteredRecipes.length / PAGE_SIZE);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <>
      <ToastContainer position="bottom-right" />
      <main className={styles.main}>
        <HomeHero heroRecipe={heroRecipe} heroImage={heroImage} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Explore por categoria</h2>
            <p>Doces, massas, entradas e outras delicias do acervo.</p>
          </div>
          <div className={styles.categoryGrid}>
            {[ALL_CATEGORY, ...categories].map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isActive={category === activeCategory}
                onSelect={(cat) => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
              />
            ))}
          </div>
        </section>

        <section className={styles.recipesLayout} id="receitas">
          <IngredientSearch
            ingredients={ingredientFilters}
            matchCount={ingredientMatchCount}
            totalRecipes={recipes.length}
            onChange={(ings) => {
              setIngredientFilters(ings);
              setCurrentPage(1);
              if (ings.length > 0) {
                setSearchQuery("");
                setActiveCategory(ALL_CATEGORY);
              }
            }}
          />

          <div className={styles.recipesMain}>
            <div className={styles.recipesHeader}>
              <div className={styles.sectionHeader}>
                <h2>Todas as receitas</h2>
                <p>Da cozinha do Marcelo para o seu dia a dia.</p>
              </div>
              <SearchBar
                value={searchQuery}
                onChange={(q) => {
                  setSearchQuery(q);
                  setCurrentPage(1);
                  if (q) setActiveCategory(ALL_CATEGORY);
                }}
                placeholder="Buscar pelo nome da receita..."
              />
            </div>

            {searchQuery && (
              <p className={styles.searchFeedback}>
                {filteredRecipes.length === 0
                  ? `Nenhuma receita encontrada para "${searchQuery}"`
                  : `${filteredRecipes.length} receita${filteredRecipes.length !== 1 ? "s" : ""} encontrada${filteredRecipes.length !== 1 ? "s" : ""} para "${searchQuery}"`}
              </p>
            )}

            <div className={styles.cardGrid}>
              {noIngredientResults ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateTitle}>
                    Nenhuma receita encontrada
                  </p>
                  <p className={styles.emptyStateSub}>
                    Não encontramos receitas com todos esses ingredientes. Tente
                    remover algum.
                  </p>
                </div>
              ) : (
                paginatedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    imageUrl={getImageUrl(recipe)}
                  />
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.pageButton} ${currentPage === i + 1 ? styles.pageButtonActive : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                    aria-label={`Página ${i + 1}`}
                    aria-current={currentPage === i + 1 ? "page" : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={styles.pageButton}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Próxima página"
                >
                  →
                </button>
              </div>
            )}
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sectionHeader}>
              <h2>Receitas em destaque</h2>
              <p>As mais acessadas do momento.</p>
            </div>
            <div className={styles.featuredList}>
              {featuredRecipes.map((recipe) => (
                <FeaturedItem
                  key={recipe.id}
                  recipe={recipe}
                  imageUrl={getImageUrl(recipe)}
                />
              ))}
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
