import { z } from "zod";

export type { Recipe, RecipeInput } from "@/types/recipes";

export const receitaInputSchema = z.object({
  titulo: z.string().min(1, "Título obrigatório"),
  resumo: z.string().min(1, "Resumo obrigatório"),
  tipo: z.string().min(1, "Tipo obrigatório"),
  tempoDePreparo: z.string().min(1, "Tempo de preparo obrigatório"),
  rendimento: z.string().min(1, "Rendimento obrigatório"),
  foto: z.string().optional().default(""),
  igredientes: z.array(z.string()).min(1, "Informe pelo menos um ingrediente"),
  preparo: z.array(z.string()).min(1, "Informe pelo menos um passo de preparo"),
  culinária: z.array(z.string()).optional().default([]),
  vegano: z.boolean().optional().default(false),
  publicada: z.boolean().optional().default(false),
  acessos: z.number().optional(),
  deleted: z.boolean().optional(),
  slug: z.string().optional(),
});

export type ReceitaInputValidado = z.infer<typeof receitaInputSchema>;
