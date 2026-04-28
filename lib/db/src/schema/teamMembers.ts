import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const teamMembersTable = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  course: text("course").notNull(),
  program: text("program").notNull(),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type TeamMember = typeof teamMembersTable.$inferSelect;
export type InsertTeamMember = typeof teamMembersTable.$inferInsert;
