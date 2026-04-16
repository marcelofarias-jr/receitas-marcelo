import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../../components/SearchBar";

describe("SearchBar", () => {
  it("renderiza input com placeholder padrão", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(
      screen.getByPlaceholderText("Buscar receitas..."),
    ).toBeInTheDocument();
  });

  it("renderiza input com placeholder customizado", () => {
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        placeholder="Buscar pelo nome..."
      />,
    );
    expect(
      screen.getByPlaceholderText("Buscar pelo nome..."),
    ).toBeInTheDocument();
  });

  it("exibe o valor recebido no input", () => {
    render(<SearchBar value="bolo" onChange={() => {}} />);
    expect(screen.getByDisplayValue("bolo")).toBeInTheDocument();
  });

  it("chama onChange ao digitar no input", () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "frango" } });
    expect(onChange).toHaveBeenCalledWith("frango");
  });

  it("exibe botão limpar quando há valor e limpa ao clicar", () => {
    const onChange = vi.fn();
    render(<SearchBar value="bolo" onChange={onChange} />);
    const clearButton = screen.getByLabelText("Limpar");
    fireEvent.click(clearButton);
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("não exibe botão limpar quando input está vazio", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByLabelText("Limpar")).not.toBeInTheDocument();
  });
});
