import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function run() {
  await db.execute(sql`TRUNCATE TABLE admin_users CASCADE;`);
  console.log("admin_users truncated.");
}
run().catch(console.error).finally(() => process.exit(0));
