export type Recipe = {
  id: number;
  slug: string;
  deleted: boolean;
  publicada: boolean;
  foto: string;
  titulo: string;
  resumo: string;
  igredientes: string[];
  preparo: string[];
  vegano: boolean;
  tipo: string;
  culinária: string[];
  tempoDePreparo: string;
  rendimento: string;
  acessos: number;
};

export type Category = {
  id: number;
  nome: string;
};

export type Favorite = {
  nome: string;
  id: number;
};

export type RecipesData = {
  receitas: Recipe[];
  categorias: Category[];
  favoritos: Favorite[];
};

export type RecipeInput = Omit<
  Recipe,
  "id" | "slug" | "acessos" | "deleted"
> & {
  slug?: string;
  acessos?: number;
  deleted?: boolean;
};

export type ImageMap = Record<string, string>;

export type RecipeAccessMap = Record<number, number>;
