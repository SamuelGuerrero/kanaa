import "server-only";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../../generated/prisma";

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL }),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (true) globalForPrisma.prisma = db;
