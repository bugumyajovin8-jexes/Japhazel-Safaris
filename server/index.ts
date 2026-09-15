import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { randomBytes } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { seedDatabase } from "./seed";

const app = express();
const httpServer = createServer(app);

function sessionFallbackSecret() {
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[session] SESSION_SECRET is not set. Using a random secret for this " +
      "process — admin sessions will not survive a restart or span instances.",
    );
    return randomBytes(32).toString("hex");
  }
  return "japhazel-dev-only-secret";
}

// Trust proxy for production (Replit uses a reverse proxy)
app.set("trust proxy", 1);

app.get("/test-server", (req, res) => {
  res.send("Server is ALIVE and RESPONDING");
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Session middleware.
// With Postgres the session table is shared by every instance, so an admin
// stays logged in across restarts and serverless cold starts. MemoryStore is
// kept only for the no-database demo path, where it can do no harm.
function buildSessionStore() {
  const url = process.env.DATABASE_URL;
  if (!url || url.startsWith("http")) {
    const MemoryStore = createMemoryStore(session);
    console.warn("[session] In-memory store (no DATABASE_URL) — logins end with the process.");
    return new MemoryStore({ checkPeriod: 86400000 });
  }
  const PgStore = connectPgSimple(session);
  console.log("[session] Postgres-backed store (user_sessions).");
  return new PgStore({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
    pruneSessionInterval: 60 * 60,
  });
}

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    // A committed fallback secret is a public secret, so production gets a
    // random per-boot value instead. Set SESSION_SECRET to keep logins alive
    // across restarts and across serverless instances.
    secret: process.env.SESSION_SECRET || sessionFallbackSecret(),
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for secure cookies behind a proxy
    store: buildSessionStore(),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      // secure + SameSite=None require HTTPS. Forcing them on in development
      // means the browser silently drops the cookie over http://localhost and
      // admin login appears to fail for no reason.
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

import fs from "fs";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const line = `${formattedTime} [${source}] ${message}`;
  console.log(line);
  try {
    fs.appendFileSync("debug.log", line + "\n");
  } catch (e) {
    // ignore
  }
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Skip logging 401 for /api/auth/me (normal behavior when not logged in)
      if (path === "/api/auth/me" && res.statusCode === 401) {
        return;
      }
      
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (req.sessionID) {
        logLine += ` [session: ${req.sessionID.slice(0, 8)}...]`;
        if (req.session.userId) {
          logLine += ` [user: ${req.session.userId}]`;
        } else {
          logLine += ` [no-user]`;
        }
      }
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// API routes go here
app.get("/api/health", async (_req, res) => {
  const { storage } = await import("./storage");
  const persistent = storage.isPersistent;
  let dbReachable: boolean | null = null;

  if (persistent) {
    try {
      const { pool } = await import("./db");
      await pool.query("select 1");
      dbReachable = true;
    } catch {
      dbReachable = false;
    }
  }

  res.status(persistent && dbReachable === false ? 503 : 200).json({
    status: persistent && dbReachable === false ? "degraded" : "ok",
    persistence: persistent ? "postgres" : "memory (demo — data is not saved)",
    dbReachable,
    time: new Date().toISOString(),
  });
});

export const setupPromise = (async () => {
  const port = parseInt(process.env.PORT || "3000", 10);
  
  log(`Checking environment: DATABASE_URL is ${process.env.DATABASE_URL ? "SET" : "NOT SET"}`);
  log(`Checking environment: NODE_ENV is ${process.env.NODE_ENV}`);
  
  if (process.env.VERCEL) {
    log("Running in Vercel serverless environment. Skipping app.listen().");
  } else {
    // Start listening immediately to satisfy platform health checks
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
      },
      () => {
        log(`Server physical port listener opened on ${port}`);
      },
    );
  }

  // Seed database with default admin user if none exists
  // We already handle resiliency inside storage and seedDatabase
  seedDatabase().catch(err => log(`Seeding failed: ${err.message}`, "seed"));

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    serveStatic(app);
  } else if (!process.env.VERCEL) {
    try {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
      log("Vite middleware setup completed");
    } catch (e) {
      log(`Failed to setup Vite middleware: ${e}`);
    }
  }
})();

export default app;
