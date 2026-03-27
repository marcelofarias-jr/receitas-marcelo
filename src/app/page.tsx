"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import { useRecipesAccess } from "./state/recipes-context";
import CategoryChip from "../components/CategoryChip/CategoryChip";
import FeaturedItem from "../components/FeaturedItem/FeaturedItem";
import HomeHero from "../components/HomeHero/HomeHero";
import RecipeCard from "../components/RecipeCard/RecipeCard";
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/api/receitas", { cache: "no-store" });
      const data = (await response.json()) as RecipesData;
      setRecipes(data.receitas ?? []);
    };

    void run();
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

  const filteredRecipes = useMemo(() => {
    if (activeCategory === allCategory) {
      return recipes;
    }

    return recipes.filter((recipe) => recipe.tipo === activeCategory);
  }, [activeCategory, recipes]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HomeHero heroRecipe={heroRecipe ?? null} heroImage={heroImage} />

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
          <div className={styles.recipesMain}>
            <div className={styles.sectionHeader}>
              <h2>Todas as receitas</h2>
              <p>Da cozinha do Marcelo para o seu dia a dia.</p>
            </div>
            <div className={styles.cardGrid}>
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  imageUrl={getImageUrl(recipe)}
                />
              ))}
            </div>
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

      <footer className={styles.footer}>
        <p>Receitas do Marcelo - feito com carinho para reunir a familia.</p>
      </footer>
    </div>
  );
}
