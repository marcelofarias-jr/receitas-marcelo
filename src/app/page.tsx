"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.scss";
import { useRecipesAccess } from "./state/recipes-context";
import ContactForm from "../components/ContactForm";
import CategoryChip from "../components/CategoryChip";
import FeaturedItem from "../components/FeaturedItem";
import FeaturedItemSkeleton from "../components/FeaturedItemSkeleton";
import HomeHero from "../components/HomeHero";
import RecipeCard from "../components/RecipeCard";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";
import IngredientSearch from "../components/IngredientSearch";
import SearchBar from "../components/SearchBar";
import {
  getIngredientMatchCount,
  useRecipeSearch,
} from "../lib/use-recipe-search";
import type { Recipe, RecipesData } from "../types/recipes";

const featuredCountFallback = 5;
const allCategory = "Todas";

function getImageUrl(recipe: Recipe): string {
  // Só aceita URLs externas (http/https) ou paths locais em /uploads/
  if (recipe.foto.startsWith("http://") || recipe.foto.startsWith("https://")) {
    return recipe.foto;
  }

  if (recipe.foto.startsWith("/uploads/")) {
    return recipe.foto;
  }

  // Se for nome de arquivo sem path, tenta em /uploads/
  if (
    recipe.foto &&
    !recipe.foto.includes("/") &&
    !recipe.foto.includes("\\")
  ) {
    return `/uploads/${recipe.foto}`;
  }

  // Nenhuma imagem válida
  return "";
}

export default function Home() {
  const { accessById } = useRecipesAccess();
  const [activeCategory, setActiveCategory] = useState(allCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredientFilters, setIngredientFilters] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = () => {
    setLoading(true);
    fetch("/api/receitas", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: RecipesData) => {
        setRecipes(data.receitas ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchRecipesRef = useRef(fetchRecipes);
  fetchRecipesRef.current = fetchRecipes;

  useEffect(() => {
    fetchRecipesRef.current();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("/api/updates");
    eventSource.onmessage = () => fetchRecipesRef.current();
    return () => eventSource.close();
  }, []);

  const featuredCount = featuredCountFallback;
  const categories = Array.from(new Set(recipes.map((recipe) => recipe.tipo)));

  const featuredRecipes = useMemo(() => {
    return [...recipes]
      .sort((first, second) => {
        const firstAccess = accessById[first.id] ?? first.acessos ?? 0;
        const secondAccess = accessById[second.id] ?? second.acessos ?? 0;

        return secondAccess - firstAccess;
      })
      .slice(0, featuredCount);
  }, [accessById, featuredCount, recipes]);

  const heroRecipe = featuredRecipes[0] ?? recipes[0];
  const heroImage = heroRecipe ? getImageUrl(heroRecipe) : "";

  const searchResults = useRecipeSearch(recipes, {
    query: searchQuery,
    ingredients: ingredientFilters,
  });

  const isFiltering =
    searchQuery.trim().length > 0 || ingredientFilters.length > 0;

  const filteredRecipes = useMemo(() => {
    const base = isFiltering ? searchResults : recipes;

    if (activeCategory === allCategory) {
      return base;
    }

    return base.filter((recipe) => recipe.tipo === activeCategory);
  }, [activeCategory, recipes, isFiltering, searchResults]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, ingredientFilters]);

  const ingredientMatchCount = useMemo(() => {
    if (!ingredientFilters.length) return 0;
    return recipes.filter(
      (r) => getIngredientMatchCount(r, ingredientFilters) > 0,
    ).length;
  }, [recipes, ingredientFilters]);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const isIngredientSearch = ingredientFilters.length > 0;
  const noIngredientResults =
    isIngredientSearch && !loading && filteredRecipes.length === 0;

  const totalPages = Math.ceil(filteredRecipes.length / PAGE_SIZE);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HomeHero
          heroRecipe={heroRecipe ?? null}
          heroImage={heroImage}
          loading={loading}
        />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Explore por categoria</h2>
            <p>Doces, massas, entradas e outras delicias do acervo.</p>
          </div>
          <div className={styles.categoryGrid}>
            {[allCategory, ...categories].map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isActive={category === activeCategory}
                onSelect={setActiveCategory}
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
              if (ings.length > 0) {
                setSearchQuery("");
                setActiveCategory(allCategory);
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
                  if (q) setActiveCategory(allCategory);
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
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))
              ) : noIngredientResults ? (
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
            {!loading && totalPages > 1 && (
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
                    className={`${styles.pageButton} ${
                      currentPage === i + 1 ? styles.pageButtonActive : ""
                    }`}
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
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <FeaturedItemSkeleton key={i} />
                  ))
                : featuredRecipes.map((recipe) => (
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

      <section className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div className={styles.contactHeader}>
            <h2>Fale comigo</h2>
            <p>
              Tem uma sugestão de receita, uma dúvida ou só quer mandar um alô?
              Preencha o formulário abaixo e responderei assim que possível.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Receitas do Marcelo - feito com carinho para reunir a familia.</p>
      </footer>
    </div>
  );
}
