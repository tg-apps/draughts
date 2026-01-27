import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chatId: integer("chat_id").notNull(),
  whitePlayer: integer("white_player"),
  blackPlayer: integer("black_player"),
  board: text("board").notNull(),
  turn: text("turn").$type<"white" | "black">().default("white").notNull(),
  selectedPos: text("selected_pos"),
  status: text("status").default("playing").notNull(),
});
