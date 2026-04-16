import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryChip from "../../components/CategoryChip";

describe("CategoryChip", () => {
  it("renderiza o label do chip", () => {
    render(
      <CategoryChip label="Sobremesa" isActive={false} onSelect={() => {}} />,
    );
    expect(screen.getByText("Sobremesa")).toBeInTheDocument();
  });

  it("aplica aria-pressed=true quando ativo", () => {
    render(
      <CategoryChip label="Sobremesa" isActive={true} onSelect={() => {}} />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("aplica aria-pressed=false quando inativo", () => {
    render(
      <CategoryChip label="Sobremesa" isActive={false} onSelect={() => {}} />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("chama onSelect com o label ao clicar", () => {
    const onSelect = vi.fn();
    render(
      <CategoryChip label="Sobremesa" isActive={false} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith("Sobremesa");
  });

  it("renderiza como button", () => {
    render(
      <CategoryChip label="Lanche" isActive={false} onSelect={() => {}} />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
