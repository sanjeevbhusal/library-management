import "dotenv/config";

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { user } from "./schema";

export const db = drizzle(sql);
// export const db2 = drizzle(sql, { schema: { user } });
