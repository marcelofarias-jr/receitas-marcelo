import { describe, it, expect } from "vitest";
import { recipeFormSchema } from "../recipe.schema";

describe("recipeFormSchema", () => {
  const dadosValidos = {
    titulo: "Bolo de Cenoura",
    resumo: "Um bolo delicioso",
    tipo: "Sobremesa",
    tempoDePreparo: "40 min",
    rendimento: "8 porções",
    ingredientesText: "farinha\naçúcar\novos",
    preparoText: "Misture tudo\nAsse por 30 min",
  };

  it("valida dados corretos com sucesso", () => {
    const resultado = recipeFormSchema.safeParse(dadosValidos);
    expect(resultado.success).toBe(true);
  });

  it("aceita campos opcionais ausentes", () => {
    const resultado = recipeFormSchema.safeParse(dadosValidos);
    expect(resultado.success).toBe(true);
  });

  it("aceita campo publicada como booleano", () => {
    const resultado = recipeFormSchema.safeParse({
      ...dadosValidos,
      publicada: true,
    });
    expect(resultado.success).toBe(true);
  });

  it("aceita campo vegano como booleano", () => {
    const resultado = recipeFormSchema.safeParse({
      ...dadosValidos,
      vegano: true,
    });
    expect(resultado.success).toBe(true);
  });

  it("rejeita título vazio", () => {
    const resultado = recipeFormSchema.safeParse({
      ...dadosValidos,
      titulo: "",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita resumo vazio", () => {
    const resultado = recipeFormSchema.safeParse({
      ...dadosValidos,
      resumo: "",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita tipo vazio", () => {
    const resultado = recipeFormSchema.safeParse({
      ...dadosValidos,
      tipo: "",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita ingredientes vazios", () => {
    const resultado = recipeFormSchema.safeParse({
      ...dadosValidos,
      ingredientesText: "",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita preparo vazio", () => {
    const resultado = recipeFormSchema.safeParse({
      ...dadosValidos,
      preparoText: "",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita quando campo obrigatório está ausente", () => {
    const { titulo, ...semTitulo } = dadosValidos;
    const resultado = recipeFormSchema.safeParse(semTitulo);
    expect(resultado.success).toBe(false);
  });
});
