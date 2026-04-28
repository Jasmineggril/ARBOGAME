import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  program: text("program").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Document = typeof documentsTable.$inferSelect;
export type InsertDocument = typeof documentsTable.$inferInsert;
