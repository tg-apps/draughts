import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

const sqlite = new Database("database.db");

sqlite.run(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    username TEXT
  );

  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    white_player INTEGER NOT NULL REFERENCES users(id),
    black_player INTEGER REFERENCES users(id),
    board TEXT NOT NULL,
    turn TEXT DEFAULT 'white' NOT NULL CHECK(turn IN ('white', 'black')),
    selected_pos TEXT,
    is_jump_chain INTEGER DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'playing' NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_user_id ON users (user_id);
  CREATE INDEX IF NOT EXISTS idx_games_chat_id ON games (chat_id);
  CREATE INDEX IF NOT EXISTS idx_games_white_player ON games (white_player);
  CREATE INDEX IF NOT EXISTS idx_games_black_player ON games (black_player);
  CREATE INDEX IF NOT EXISTS idx_games_status ON games (status);
`);

const db = drizzle(sqlite, { schema });

export { db };
