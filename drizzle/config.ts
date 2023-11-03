import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "drizzle/schema.ts",
  driver: "pg",
  dbCredentials: {
    host: process.env.POSTGRES_HOST || "",
    password: process.env.POSTGRES_PASSWORD || "",
    user: process.env.POSTGRES_USER,
    port: 5432,
    database: process.env.POSTGRES_DATABASE || "",
  },
  out: "drizzle/migrations",
} satisfies Config;
