import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

const COOKIE_NAME = "session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export type PublicUser = {
  id: string;
  email: string;
  name: string;
};

type UserRow = PublicUser & { password_hash: string };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function findUserByEmail(email: string) {
  return getDb()
    .prepare(
      "SELECT id, email, name, password_hash FROM users WHERE email = ?",
    )
    .get(email) as UserRow | undefined;
}

export async function authenticate(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return null;
  }
  return { id: user.id, email: user.email, name: user.name };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_MS);
  const db = getDb();

  db.prepare("DELETE FROM sessions WHERE user_id = ? OR expires_at <= ?").run(
    userId,
    Date.now(),
  );
  db.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
  ).run(hashToken(token), userId, expiresAt.getTime());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    getDb()
      .prepare("DELETE FROM sessions WHERE token_hash = ?")
      .run(hashToken(token));
  }
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const row = getDb()
    .prepare(
      `SELECT users.id AS id, users.email AS email, users.name AS name
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ? AND sessions.expires_at > ?`,
    )
    .get(hashToken(token), Date.now()) as PublicUser | undefined;

  return row ?? null;
}
