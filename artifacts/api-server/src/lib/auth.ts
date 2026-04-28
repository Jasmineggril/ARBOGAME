import type { Request, Response, NextFunction, RequestHandler } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";

const SESSION_SECRET = process.env.SESSION_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}
if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD must be set");
}

const adminPassword: string = ADMIN_PASSWORD;

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

const PgStore = connectPgSimple(session);

export const sessionMiddleware: RequestHandler = session({
  store: new PgStore({
    pool,
    tableName: "sessions",
    createTableIfMissing: false,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
  name: "arbogame.sid",
});

export function checkPassword(password: string): boolean {
  if (typeof password !== "string") return false;
  if (password.length !== adminPassword.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ adminPassword.charCodeAt(i);
  }
  return mismatch === 0;
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.session?.isAdmin) {
    next();
    return;
  }
  res.status(401).json({ message: "Admin authentication required" });
}
