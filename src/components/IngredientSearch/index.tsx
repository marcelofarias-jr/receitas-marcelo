import { useRef, useState } from "react";
import styles from "./IngredientSearch.module.scss";

type IngredientSearchProps = {
  ingredients: string[];
  matchCount: number;
  totalRecipes: number;
  onChange: (ingredients: string[]) => void;
};

export default function IngredientSearch({
  ingredients,
  matchCount,
  totalRecipes,
  onChange,
}: IngredientSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addIngredient(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    if (ingredients.some((i) => i.toLowerCase() === normalized)) return;
    onChange([...ingredients, trimmed]);
    setInputValue("");
  }

  function removeIngredient(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && ingredients.length > 0) {
      onChange(ingredients.slice(0, -1));
    }
  }

  const isActive = ingredients.length > 0;

  return (
    <aside className={`${styles.panel} ${isActive ? styles.panelActive : ""}`}>
      <div className={styles.badge}>✨ Novo</div>

      <div className={styles.iconRow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <line x1="8" y1="3" x2="8" y2="21" />
        </svg>
        <h2 className={styles.title}>O que tem na sua geladeira?</h2>
      </div>

      <p className={styles.description}>
        Digite os ingredientes que você tem em casa e veja{" "}
        <strong>quais receitas você já pode fazer agora</strong> — sem precisar
        saber o nome do prato.
      </p>

      <div
        className={styles.tagInputWrapper}
        onClick={() => inputRef.current?.focus()}
      >
        {ingredients.map((ing, i) => (
          <span key={i} className={styles.tag}>
            {ing}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeIngredient(i);
              }}
              aria-label={`Remover ${ing}`}
              className={styles.tagRemove}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.tagInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addIngredient(inputValue)}
          placeholder={
            ingredients.length === 0 ? "Ex: farinha, ovo, chocolate..." : ""
          }
          aria-label="Adicionar ingrediente"
        />
      </div>

      <p className={styles.hint}>Pressione Enter ou vírgula para adicionar</p>

      {isActive && (
        <div className={styles.result}>
          <span className={styles.resultCount}>
            {matchCount === 0
              ? "Nenhuma receita encontrada"
              : `${matchCount} receita${matchCount !== 1 ? "s" : ""} encontrada${matchCount !== 1 ? "s" : ""}`}
          </span>
          {matchCount > 0 && (
            <span className={styles.resultSub}>
              de {totalRecipes} disponíveis
            </span>
          )}
        </div>
      )}

      {isActive && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => onChange([])}
        >
          Limpar ingredientes
        </button>
      )}

      {!isActive && (
        <div className={styles.examples}>
          <p className={styles.examplesLabel}>Tente com:</p>
          <div className={styles.exampleChips}>
            {["Ovo", "Farinha", "Chocolate", "Manteiga", "Banana"].map((ex) => (
              <button
                key={ex}
                type="button"
                className={styles.exampleChip}
                onClick={() => onChange([...ingredients, ex])}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
