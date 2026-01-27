import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

const sqlite = new Database("database.db");

sqlite.run(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    white_player INTEGER,
    black_player INTEGER,
    board TEXT NOT NULL,
    turn TEXT DEFAULT 'white' NOT NULL,
    selected_pos TEXT,
    status TEXT DEFAULT 'playing' NOT NULL
  )
`);

const db = drizzle(sqlite, { schema });

export { db };
