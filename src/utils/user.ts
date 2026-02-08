import type { User } from "grammy/types";

import { db } from "#db";
import { users, type UserData } from "#db/schema";
import { eq } from "drizzle-orm";

export function upsertUser(user: User): UserData {
  return db
    .insert(users)
    .values({
      userId: user.id,
      firstName: user.first_name,
      username: user.username,
    })
    .onConflictDoUpdate({
      target: users.userId, // The column with the unique constraint
      set: { firstName: user.first_name, username: user.username },
    })
    .returning()
    .get();
}

export function getUserDisplayName(userId: number): string {
  const user = db.select().from(users).where(eq(users.userId, userId)).get();
  if (!user) return `User ${userId}`;
  return user.username ? `@${user.username}` : user.firstName;
}
