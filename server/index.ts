import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import session from "express-session";
import createMemoryStore from "memorystore";
import { seedDatabase } from "./seed";

const app = express();
const httpServer = createServer(app);

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

// Session middleware
const MemoryStore = createMemoryStore(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "japhazel-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for secure cookies behind a proxy
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
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
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
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
