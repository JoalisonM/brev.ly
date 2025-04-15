import { uuidv7 } from "uuidv7";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  url: text("url").notNull(),
  shortUrl: text("short_url").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  clicks: integer().default(0).notNull(),
});
