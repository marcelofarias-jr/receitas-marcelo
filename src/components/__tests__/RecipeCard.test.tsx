import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RecipeCard from "../../components/RecipeCard";
import type { Recipe } from "../../types/recipes";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

const receita: Recipe = {
  id: 1,
  slug: "bolo-de-cenoura",
  deleted: false,
  publicada: true,
  foto: "/uploads/bolo.jpg",
  titulo: "Bolo de Cenoura",
  resumo: "O melhor bolo de cenoura com cobertura de chocolate",
  igredientes: ["cenoura", "farinha", "açúcar"],
  preparo: ["Misture tudo", "Asse por 30 min"],
  vegano: false,
  tipo: "Sobremesa",
  culinária: ["Brasileira"],
  tempoDePreparo: "40 min",
  rendimento: "8 porções",
  acessos: 42,
};

describe("RecipeCard", () => {
  it("renderiza o título da receita", () => {
    render(<RecipeCard recipe={receita} imageUrl="/uploads/bolo.jpg" />);
    expect(screen.getByText("Bolo de Cenoura")).toBeInTheDocument();
  });

  it("renderiza o resumo da receita", () => {
    render(<RecipeCard recipe={receita} imageUrl="/uploads/bolo.jpg" />);
    expect(
      screen.getByText("O melhor bolo de cenoura com cobertura de chocolate"),
    ).toBeInTheDocument();
  });

  it("renderiza o tempo de preparo", () => {
    render(<RecipeCard recipe={receita} imageUrl="/uploads/bolo.jpg" />);
    expect(screen.getByText("40 min")).toBeInTheDocument();
  });

  it("renderiza a categoria", () => {
    render(<RecipeCard recipe={receita} imageUrl="/uploads/bolo.jpg" />);
    const tags = screen.getAllByText("Sobremesa");
    expect(tags.length).toBeGreaterThanOrEqual(1);
  });

  it("gera links para a página da receita", () => {
    render(<RecipeCard recipe={receita} imageUrl="/uploads/bolo.jpg" />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/receitas/bolo-de-cenoura");
    });
  });

  it("renderiza placeholder quando imageUrl é vazia", () => {
    const { container } = render(<RecipeCard recipe={receita} imageUrl="" />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
