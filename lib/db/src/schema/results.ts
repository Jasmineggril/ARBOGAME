import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { gamesTable } from "./games";

export const resultsTable = pgTable("results", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  participants: integer("participants").notNull().default(0),
  satisfactionScore: real("satisfaction_score"),
  learningScore: real("learning_score"),
  methodology: text("methodology").notNull(),
  gameId: integer("game_id").references(() => gamesTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("results_created_at_idx").on(table.createdAt),
  index("results_game_id_idx").on(table.gameId),
]);

export type Result = typeof resultsTable.$inferSelect;
export type InsertResult = typeof resultsTable.$inferInsert;
