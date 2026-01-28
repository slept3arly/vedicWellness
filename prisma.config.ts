import "dotenv/config";
import { defineConfig } from "prisma/config";

const ACCELERATE_URL = process.env.PRISMA_DATABASE_URL;
const DIRECT_URL = process.env.DATABASE_URL;

if (!ACCELERATE_URL) {
  throw new Error("Missing PRISMA_DATABASE_URL (Accelerate connection)");
}

if (!DIRECT_URL) {
  throw new Error("Missing DATABASE_URL (direct database connection)");
}

export default defineConfig({
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: ACCELERATE_URL,     // runtime
    directUrl: DIRECT_URL,  // migrations
  },
});
