import { defineConfig } from "drizzle-kit";

// Helper to fix DATABASE_URL if it has special characters in the password
function getConnectionString() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return undefined;
  
  try {
    new URL(dbUrl);
    return dbUrl;
  } catch (e) {
    const match = dbUrl.match(/^(postgresql|postgres):\/\/([^:]+):([^@]+)@([^/:]+)(?::(\d+))?\/([^?]+)(\?.*)?$/);
    if (match) {
      const [_, proto, user, pass, host, port, dbName, query] = match;
      const encodedPass = encodeURIComponent(pass);
      return `${proto}://${user}:${encodedPass}@${host}${port ? ':' + port : ''}/${dbName}${query || ''}`;
    }
    return dbUrl;
  }
}

const url = getConnectionString();

if (!url) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
