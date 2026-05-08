import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const roadmap = pgTable("roadmap", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descAr: text("desc_ar").notNull(),
  descEn: text("desc_en").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descAr: text("desc_ar").notNull(),
  descEn: text("desc_en").notNull(),
  icon: text("icon").notNull().default("spark"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type RoadmapRow = typeof roadmap.$inferSelect;
export type AchievementRow = typeof achievements.$inferSelect;
