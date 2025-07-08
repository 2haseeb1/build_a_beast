// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// This tells TypeScript that a 'prisma' property might exist on the global scope.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// This is the core logic:
// 1. Check if an instance of Prisma already exists on the global object.
// 2. If it does, reuse it.
// 3. If it doesn't, create a new one.
export const prisma = globalThis.prisma ?? new PrismaClient();

// In development, we save the instance to the global object.
// This is because hot-reloading would otherwise create a new instance on every file change.
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
