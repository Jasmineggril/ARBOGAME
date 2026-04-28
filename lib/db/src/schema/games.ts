import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const gamesTable = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  kind: text("kind").notNull(),
  playUrl: text("play_url"),
  imageUrl: text("image_url"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Game = typeof gamesTable.$inferSelect;
export type InsertGame = typeof gamesTable.$inferInsert;
