/**
 * One-shot database setup.
 *
 *   npm run db:setup
 *
 * Applies the SQL migrations in ./migrations to whatever DATABASE_URL points
 * at, then reports what is in each table. Safe to run repeatedly: Drizzle
 * records which migrations have already been applied.
 */
import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { db, pool } from "../server/db";

const REQUIRED_TABLES = [
  "admin_users",
  "tours",
  "bookings",
  "gallery_items",
  "contact_messages",
  "site_settings",
];

async function main() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error(
      "\nDATABASE_URL is not set.\n\n" +
      "Create a .env file in the project root containing:\n" +
      "  DATABASE_URL=postgresql://user:password@host:5432/dbname\n\n" +
      "See .env.example, or DATABASE.md for how to get a connection string.\n",
    );
    process.exit(1);
  }

  if (url.startsWith("http")) {
    console.error(
      "\nDATABASE_URL looks like an API URL, not a Postgres connection string.\n" +
      "In Supabase use Settings > Database > Connection string > URI.\n",
    );
    process.exit(1);
  }

  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return "(unparseable host)";
    }
  })();

  console.log(`Connecting to ${host} ...`);
  await pool.query("select 1");
  console.log("Connected.");

  console.log("Applying migrations from ./migrations ...");
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("Migrations applied.");

  // Confirm the tables the app actually needs are present.
  const { rows } = await pool.query<{ table_name: string }>(
    `select table_name from information_schema.tables
      where table_schema = 'public'`,
  );
  const present = new Set(rows.map((r) => r.table_name));
  const missing = REQUIRED_TABLES.filter((t) => !present.has(t));

  if (missing.length) {
    console.error(`\nMissing tables after migration: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log("\nRow counts:");
  for (const table of REQUIRED_TABLES) {
    const r = await db.execute(sql.raw(`select count(*)::int as n from "${table}"`));
    const n = (r.rows[0] as { n: number }).n;
    console.log(`  ${table.padEnd(18)} ${n}`);
  }

  console.log(
    "\nDatabase is ready. Start the app with `npm run dev` — it will seed tours\n" +
    "and gallery images on first boot, and bookings will now persist.\n",
  );
}

main()
  .catch((err) => {
    console.error("\nDatabase setup failed:\n", err);
    process.exit(1);
  })
  .finally(() => pool.end());
