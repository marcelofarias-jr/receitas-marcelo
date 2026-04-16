import { describe, it, expect } from "vitest";
import { slugify } from "../slugify";

describe("slugify", () => {
  it("converte texto simples para slug", () => {
    expect(slugify("Frango Grelhado")).toBe("frango-grelhado");
  });

  it("remove acentos e cedilha", () => {
    expect(slugify("Frango à Milanesa")).toBe("frango-a-milanesa");
    expect(slugify("Açaí com Banana")).toBe("acai-com-banana");
    expect(slugify("Pão de Queijo")).toBe("pao-de-queijo");
  });

  it("substitui múltiplos espaços por um único hífen", () => {
    expect(slugify("bolo   de   cenoura")).toBe("bolo-de-cenoura");
  });

  it("remove caracteres especiais", () => {
    expect(slugify("receita #1: bolo!")).toBe("receita-1-bolo");
  });

  it("remove hífens no início e fim", () => {
    expect(slugify(" -bolo- ")).toBe("bolo");
  });

  it("retorna string em minúsculas", () => {
    expect(slugify("BOLO DE CHOCOLATE")).toBe("bolo-de-chocolate");
  });

  it("retorna 'receita' para string vazia", () => {
    expect(slugify("")).toBe("receita");
    expect(slugify("   ")).toBe("receita");
  });

  it("preserva números", () => {
    expect(slugify("Receita 42")).toBe("receita-42");
  });

  it("lida com vogais acentuadas diversas", () => {
    expect(slugify("crème brûlée")).toBe("creme-brulee");
    expect(slugify("über naïve")).toBe("uber-naive");
  });
});
