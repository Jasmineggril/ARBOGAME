import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";

export const resultsTable = pgTable("results", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  participants: integer("participants").notNull().default(0),
  satisfactionScore: real("satisfaction_score"),
  learningScore: real("learning_score"),
  methodology: text("methodology").notNull(),
  gameId: integer("game_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Result = typeof resultsTable.$inferSelect;
export type InsertResult = typeof resultsTable.$inferInsert;
