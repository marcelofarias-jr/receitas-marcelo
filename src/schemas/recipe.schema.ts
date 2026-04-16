import { z } from "zod";

export const recipeFormSchema = z.object({
  titulo: z.string().min(1, "Informe o título da receita."),
  resumo: z.string().min(1, "Informe um resumo curto."),
  tipo: z.string().min(1, "Informe o tipo da receita."),
  tempoDePreparo: z.string().min(1, "Informe o tempo de preparo."),
  rendimento: z.string().min(1, "Informe o rendimento."),
  fotoUrl: z.string().optional(),
  fotoFile: z.any().optional(),
  culinariaText: z.string().optional(),
  ingredientesText: z.string().min(1, "Informe pelo menos um ingrediente."),
  preparoText: z.string().min(1, "Descreva o modo de preparo."),
  vegano: z.boolean().optional(),
  publicada: z.boolean().optional(),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
