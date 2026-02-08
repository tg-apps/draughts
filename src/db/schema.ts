import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().unique(),
    firstName: text("first_name").notNull(),
    username: text("username"),
  },
  (table) => [index("idx_users_user_id").on(table.userId)],
);

export type UserData = (typeof users)["$inferSelect"];

export const games = sqliteTable(
  "games",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    chatId: integer("chat_id").notNull(),
    whitePlayer: integer("white_player")
      .notNull()
      .references(() => users.id),
    blackPlayer: integer("black_player").references(() => users.id),
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
  },
  (table) => [
    index("idx_games_chat_id").on(table.chatId),
    index("idx_games_white_player").on(table.whitePlayer),
    index("idx_games_black_player").on(table.blackPlayer),
    index("idx_games_status").on(table.status),
  ],
);

export type GameInfo = (typeof games)["$inferSelect"];
