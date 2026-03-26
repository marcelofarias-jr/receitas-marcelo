"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { RecipeAccessMap } from "../../types/recipes";

type RecipesContextValue = {
  accessById: RecipeAccessMap;
  registerView: (id: number) => void;
};

const initialAccess: RecipeAccessMap = {};

const RecipesContext = createContext<RecipesContextValue | undefined>(
  undefined,
);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [accessById, setAccessById] = useState<RecipeAccessMap>(initialAccess);

  const registerView = useCallback((id: number) => {
    setAccessById((previous) => ({
      ...previous,
      [id]: (previous[id] ?? 0) + 1,
    }));
  }, []);

  const value = useMemo(
    () => ({
      accessById,
      registerView,
    }),
    [accessById, registerView],
  );

  return (
    <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
  );
}

export function useRecipesAccess() {
  const context = useContext(RecipesContext);

  if (!context) {
    throw new Error("useRecipesAccess must be used within RecipesProvider");
  }

  return context;
}
