import "dotenv/config";
import { defineConfig } from "prisma/config";

const URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!URL) {
  throw new Error("Missing DATABASE_URL (or POSTGRES_URL). Check .env");
}

export default defineConfig({
  migrations: { path: "prisma/migrations" },
  datasource: { url: URL },
});
