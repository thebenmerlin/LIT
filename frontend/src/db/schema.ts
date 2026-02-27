import { pgTable, varchar, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";

export const cases = pgTable("cases", {
    id: varchar("id").primaryKey(), // e.g. "C-1988-234"
    score: real("score").notNull(),
    title: text("title").notNull(),
    court: text("court").notNull(),
    year: integer("year").notNull(),
    sections: text("sections"),
    summary: text("summary"),
    abstract: text("abstract"),
    citations: jsonb("citations").$type<string[]>(),
});

export const savedCases = pgTable("saved_cases", {
    id: varchar("id").primaryKey(), // We can just use the case_id as the primary key since a case can only be saved once per user (or globally in this demo)
    caseId: varchar("case_id").references(() => cases.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
