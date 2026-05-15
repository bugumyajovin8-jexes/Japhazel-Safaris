import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function run() {
  try {
    await db.execute(sql`
      ALTER TABLE contact_messages
      RENAME COLUMN first_name TO name;
      
      ALTER TABLE contact_messages
      DROP COLUMN last_name;

      ALTER TABLE contact_messages
      ADD COLUMN phone_number text;

      ALTER TABLE contact_messages
      ALTER COLUMN email DROP NOT NULL;

      ALTER TABLE contact_messages
      ALTER COLUMN subject DROP NOT NULL;

      ALTER TABLE contact_messages
      ALTER COLUMN message DROP NOT NULL;

      ALTER TABLE contact_messages
      ALTER COLUMN name DROP NOT NULL;
    `);
    console.log("Contact messages table altered successfully.");
  } catch (error) {
    console.error("Error altering table", error);
  }
}
run().catch(console.error).finally(() => process.exit(0));
