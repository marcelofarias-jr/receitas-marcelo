import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  deleted: boolean("deleted").notNull().default(false),
  foto: text("foto").notNull(),
  titulo: text("titulo").notNull(),
  resumo: text("resumo").notNull(),
  igredientes: jsonb("igredientes").$type<string[]>().notNull(),
  preparo: jsonb("preparo").$type<string[]>().notNull(),
  vegano: boolean("vegano").notNull().default(false),
  tipo: text("tipo").notNull(),
  culinaria: jsonb("culinaria").$type<string[]>().notNull(),
  tempoDePreparo: text("tempo_de_preparo").notNull(),
  rendimento: text("rendimento").notNull(),
  acessos: integer("acessos").notNull().default(0),
  destaque: boolean("destaque").notNull().default(false),
  publicada: boolean("publicada").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type RecipeRow = typeof recipes.$inferSelect;
export type RecipeInsert = typeof recipes.$inferInsert;
