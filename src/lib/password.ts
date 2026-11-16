import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const actual = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(actual, expected);
}
