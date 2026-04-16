import { describe, it, expect } from "vitest";
import { contactFormSchema } from "../contact.schema";

describe("contactFormSchema", () => {
  const dadosValidos = {
    nome: "João Silva",
    email: "joao@email.com",
    assunto: "Sugestão de receita",
    mensagem: "Adorei o site! Poderia adicionar receitas veganas?",
  };

  it("valida dados corretos com sucesso", () => {
    const resultado = contactFormSchema.safeParse(dadosValidos);
    expect(resultado.success).toBe(true);
  });

  it("rejeita nome curto demais (menos de 2 caracteres)", () => {
    const resultado = contactFormSchema.safeParse({
      ...dadosValidos,
      nome: "J",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const resultado = contactFormSchema.safeParse({
      ...dadosValidos,
      email: "email-invalido",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita assunto curto demais (menos de 3 caracteres)", () => {
    const resultado = contactFormSchema.safeParse({
      ...dadosValidos,
      assunto: "Oi",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita mensagem curta demais (menos de 10 caracteres)", () => {
    const resultado = contactFormSchema.safeParse({
      ...dadosValidos,
      mensagem: "Oi",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita dados ausentes", () => {
    const resultado = contactFormSchema.safeParse({});
    expect(resultado.success).toBe(false);
  });

  it("aceita e-mail com subdomínio", () => {
    const resultado = contactFormSchema.safeParse({
      ...dadosValidos,
      email: "user@mail.empresa.com.br",
    });
    expect(resultado.success).toBe(true);
  });
});
