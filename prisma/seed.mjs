import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;
const databaseUrl = process.env.DATABASE_URL;

if (!tursoUrl && !databaseUrl) {
  throw new Error("TURSO_DATABASE_URL or DATABASE_URL must be set");
}

const prisma = new PrismaClient({
  adapter: tursoUrl
    ? new PrismaLibSql({ url: tursoUrl, authToken: tursoAuthToken })
    : new PrismaBetterSqlite3({ url: databaseUrl }),
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(__dirname, "../lib/cnbv_enriched.csv");

function parseCsvLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return [];
  const fields = [];
  let i = 0;
  while (i <= trimmed.length) {
    if (trimmed[i] === '"') {
      let field = "";
      i++; // skip opening quote
      while (i < trimmed.length) {
        if (trimmed[i] === '"' && trimmed[i + 1] === '"') {
          field += '"';
          i += 2;
        } else if (trimmed[i] === '"') {
          i++; // skip closing quote
          break;
        } else {
          field += trimmed[i++];
        }
      }
      fields.push(field);
      if (trimmed[i] === ",") i++; // skip comma
    } else {
      const end = trimmed.indexOf(",", i);
      if (end === -1) {
        fields.push(trimmed.slice(i));
        break;
      }
      fields.push(trimmed.slice(i, end));
      i = end + 1;
    }
  }
  return fields;
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found at ${csvPath}`);
  }

  await prisma.cnbv.deleteMany();

  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  });

  let headers = null;
  let batch = [];
  let total = 0;

  for await (const line of rl) {
    if (!headers) {
      headers = parseCsvLine(line);
      continue;
    }

    if (!line.trim()) continue;

    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(`CSV row length mismatch. Expected ${headers.length}, got ${values.length}`);
    }

    const record = Object.fromEntries(
      headers.map((key, idx) => {
        const val = values[idx];
        if (key === "ocupacion_promedio") return [key, val ? parseFloat(val) : null];
        return [key, val ?? null];
      })
    );

    batch.push(record);

    if (batch.length >= 1000) {
      await prisma.cnbv.createMany({ data: batch });
      total += batch.length;
      batch = [];
    }
  }

  if (batch.length > 0) {
    await prisma.cnbv.createMany({ data: batch });
    total += batch.length;
  }

  console.log(`Seeded Cnbv rows: ${total}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
