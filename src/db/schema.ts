import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chatId: integer("chat_id").notNull(),
  whitePlayer: integer("white_player"),
  blackPlayer: integer("black_player"),
  board: text("board").notNull(),
  turn: text("turn").$type<"white" | "black">().default("white").notNull(),
  selectedPos: text("selected_pos"),
  isJumpChain: integer("is_jump_chain", { mode: "boolean" })
    .default(false)
    .notNull(),
  status: text("status")
    .$type<"playing" | "white_won" | "black_won" | "draw">()
    .default("playing")
    .notNull(),
});

export type GameInfo = (typeof games)["$inferSelect"];
