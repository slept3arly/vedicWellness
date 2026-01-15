import "dotenv/config";
import { defineConfig } from "prisma/config";

const URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.PRISMA_DATABASE_URL;

if (!URL) {
  throw new Error(
    "Missing POSTGRES_URL (or DATABASE_URL / PRISMA_DATABASE_URL). Check your .env"
  );
}

export default defineConfig({
  migrations: { path: "prisma/migrations" },
  datasource: { url: URL },
});
