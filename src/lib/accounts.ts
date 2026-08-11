import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import type { CreateAccountInput } from "./accounts.types";
import type { User } from "./types";

export async function createAccount(
  input: CreateAccountInput
): Promise<User> {
  const db = await getDb();
  const email = input.email.toLowerCase();
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) throw new Error("Email already registered");

  const pendingStoreSlug = `account-${input.id}`;
  await db.insert(users).values({
    id: input.id,
    email,
    name: input.name,
    passwordHash: input.passwordHash,
    storeName: "",
    storeSlug: pendingStoreSlug,
    environment: input.environment,
    activeStoreId: null,
    createdAt: input.createdAt,
  });

  return {
    ...input,
    email,
    storeName: "",
    storeSlug: pendingStoreSlug,
    activeStoreId: input.id,
  };
}
