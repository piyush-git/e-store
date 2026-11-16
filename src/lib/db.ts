import "server-only";

import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "@/lib/password";
import { seedUser } from "@/lib/seed";

const globalForDb = globalThis as unknown as { sqlite?: Database.Database };

function createDatabase() {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });

  const db = new Database(path.join(dir, "store.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
  `);

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(seedUser.email);
  if (!existing) {
    db.prepare(
      `INSERT INTO users (id, email, name, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(
      randomUUID(),
      seedUser.email,
      seedUser.name,
      hashPassword(seedUser.password),
      Date.now(),
    );
  }

  return db;
}

export function getDb() {
  if (!globalForDb.sqlite) {
    globalForDb.sqlite = createDatabase();
  }
  return globalForDb.sqlite;
}
