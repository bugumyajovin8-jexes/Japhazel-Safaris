import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Helper to fix DATABASE_URL if it has special characters in the password
function getConnectionString() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return undefined;
  
  // Robust regex for postgres URLs
  const match = dbUrl.match(/^(postgresql|postgres):\/\/([^:]+):([^@]+)@([^/:]+)(?::(\d+))?\/([^?]+)(\?.*)?$/);
  if (match) {
    const [_, proto, user, pass, host, port, dbName, query] = match;
    try {
      // If the password already contains %, it might already be encoded
      // We decode it first to get the 'raw' password, then encode it properly
      // This handles both cases: raw password with special chars AND already encoded password
      const decodedPass = decodeURIComponent(pass);
      const encodedPass = encodeURIComponent(decodedPass);
      return `${proto}://${user}:${encodedPass}@${host}${port ? ':' + port : ''}/${dbName}${query || ''}`;
    } catch (e) {
      // If decoding fails, it's definitely not encoded correctly, so we encode it as is
      return `${proto}://${user}:${encodeURIComponent(pass)}@${host}${port ? ':' + port : ''}/${dbName}${query || ''}`;
    }
  }
  
  return dbUrl;
}

const connectionString = getConnectionString();

if (!process.env.DATABASE_URL) {
  console.warn(
    "Warning: DATABASE_URL is not set. Database features will not work. " +
    "Please add DATABASE_URL in the Secrets panel."
  );
} else if (process.env.DATABASE_URL.startsWith("http")) {
  const msg = "CRITICAL CONFIG ERROR: DATABASE_URL is set to an HTTPS URL instead of a POSTGRESQL connection string. " +
              "Go to Supabase Settings > Database > Connection String > Node.js and copy the URI.";
  console.error(msg);
}

export const pool = new Pool({ 
  connectionString,
  ssl: connectionString?.includes("supabase") || process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false } 
    : false,
  connectionTimeoutMillis: 15000,
});

// Add a specific error handler for the pool to diagnose IPv6 issues
pool.on('error', (err) => {
  if ('code' in err && err.code === 'ECONNREFUSED' && err.message.includes(':')) {
    console.error(
      "\n--- DATABASE CONNECTION ERROR ---\n" +
      "The connection was refused (ECONNREFUSED) over IPv6.\n" +
      "Supabase has deprecated direct IPv4 connections for some projects.\n" +
      "FIX: In your Supabase dashboard, go to Settings > Database > Connection String,\n" +
      "select 'Transaction' mode (port 6543) and use that URI as your DATABASE_URL.\n" +
      "-------------------------------\n"
    );
  } else {
    console.error('Unexpected database pool error:', err);
  }
});

export const db = drizzle(pool, { schema });
