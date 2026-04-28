import { pgTable, serial, text, timestamp, date, index } from "drizzle-orm/pg-core";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  eventDate: date("event_date", { mode: "string" }).notNull(),
  kind: text("kind").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("events_event_date_idx").on(table.eventDate),
  index("events_created_at_idx").on(table.createdAt),
  index("events_kind_idx").on(table.kind),
]);

export type Event = typeof eventsTable.$inferSelect;
export type InsertEvent = typeof eventsTable.$inferInsert;
