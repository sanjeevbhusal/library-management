import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import "dotenv/config";

const db = drizzle(sql);

async function main() {
  console.log("Migrating Tables...");
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  console.log("Migration succesfull...");
}

main()
  .catch((err) => console.log(err))
  .finally(() => process.exit(0));
