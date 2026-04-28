import { pgTable, serial, text, timestamp, date } from "drizzle-orm/pg-core";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  eventDate: date("event_date", { mode: "string" }).notNull(),
  kind: text("kind").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Event = typeof eventsTable.$inferSelect;
export type InsertEvent = typeof eventsTable.$inferInsert;
