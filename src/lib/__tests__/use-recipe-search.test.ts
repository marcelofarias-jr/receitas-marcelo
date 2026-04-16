import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRecipeSearch, getIngredientMatchCount } from "../use-recipe-search";
import type { Recipe } from "../../types/recipes";

function criarReceita(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 1,
    slug: "teste",
    deleted: false,
    publicada: true,
    foto: "",
    titulo: "Receita Teste",
    resumo: "Uma receita de teste",
    igredientes: ["farinha", "açúcar", "ovos"],
    preparo: ["Misture tudo", "Asse por 30 min"],
    vegano: false,
    tipo: "Sobremesa",
    culinária: ["Brasileira"],
    tempoDePreparo: "40 min",
    rendimento: "8 porções",
    acessos: 0,
    ...overrides,
  };
}

const receitas: Recipe[] = [
  criarReceita({
    id: 1,
    slug: "bolo-de-cenoura",
    titulo: "Bolo de Cenoura",
    igredientes: ["cenoura", "farinha", "açúcar", "ovos", "óleo"],
    tipo: "Sobremesa",
  }),
  criarReceita({
    id: 2,
    slug: "frango-grelhado",
    titulo: "Frango Grelhado",
    igredientes: ["frango", "alho", "limão", "azeite"],
    tipo: "Prato Principal",
  }),
  criarReceita({
    id: 3,
    slug: "pao-de-queijo",
    titulo: "Pão de Queijo",
    igredientes: ["polvilho", "queijo", "ovos", "óleo"],
    tipo: "Lanche",
  }),
];

describe("useRecipeSearch", () => {
  it("retorna todas as receitas quando não há filtro", () => {
    const { result } = renderHook(() =>
      useRecipeSearch(receitas, { query: "" }),
    );
    expect(result.current).toEqual(receitas);
  });

  it("filtra por nome da receita", () => {
    const { result } = renderHook(() =>
      useRecipeSearch(receitas, { query: "bolo" }),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].slug).toBe("bolo-de-cenoura");
  });

  it("busca sem acento encontra receita com acento", () => {
    const { result } = renderHook(() =>
      useRecipeSearch(receitas, { query: "pao" }),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].slug).toBe("pao-de-queijo");
  });

  it("busca é case-insensitive", () => {
    const { result } = renderHook(() =>
      useRecipeSearch(receitas, { query: "FRANGO" }),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].slug).toBe("frango-grelhado");
  });

  it("retorna vazio quando nada corresponde", () => {
    const { result } = renderHook(() =>
      useRecipeSearch(receitas, { query: "sushi" }),
    );
    expect(result.current).toHaveLength(0);
  });

  it("filtra por ingredientes", () => {
    const { result } = renderHook(() =>
      useRecipeSearch(receitas, { query: "", ingredients: ["queijo"] }),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].slug).toBe("pao-de-queijo");
  });

  it("filtra por múltiplos ingredientes (todos devem estar presentes)", () => {
    const { result } = renderHook(() =>
      useRecipeSearch(receitas, {
        query: "",
        ingredients: ["ovos", "óleo"],
      }),
    );
    expect(result.current).toHaveLength(2);
    const slugs = result.current.map((r) => r.slug);
    expect(slugs).toContain("bolo-de-cenoura");
    expect(slugs).toContain("pao-de-queijo");
  });

  it("combina busca por nome e ingredientes", () => {
    const { result } = renderHook(() =>
      useRecipeSearch(receitas, {
        query: "bolo",
        ingredients: ["cenoura"],
      }),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].slug).toBe("bolo-de-cenoura");
  });
});

describe("getIngredientMatchCount", () => {
  const receita = criarReceita({
    igredientes: ["farinha", "açúcar", "ovos"],
  });

  it("retorna contagem quando todos os ingredientes estão presentes", () => {
    expect(getIngredientMatchCount(receita, ["farinha", "ovos"])).toBe(2);
  });

  it("retorna 0 quando algum ingrediente não é encontrado", () => {
    expect(getIngredientMatchCount(receita, ["farinha", "chocolate"])).toBe(0);
  });

  it("retorna 0 para lista vazia de ingredientes", () => {
    expect(getIngredientMatchCount(receita, [])).toBe(0);
  });

  it("busca parcial funciona (ingrediente contido no texto)", () => {
    expect(getIngredientMatchCount(receita, ["farinh"])).toBe(1);
  });
});
