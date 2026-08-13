import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local / .env"
  );
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: Cached | undefined;
}

const cached: Cached = globalThis.mongooseCache ?? { conn: null, promise: null };

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 6000,
      })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  globalThis.mongooseCache = cached;
  await bootstrapAccounts();
  return cached.conn;
}

/* ── One-time account bootstrap ──
 * Creates the admin + technician accounts from env vars the first time the
 * app connects. Safe to leave in production: it only creates accounts that
 * are explicitly configured and do not already exist.
 */
async function bootstrapAccounts(): Promise<void> {
  const global = globalThis as unknown as { __cmpBootstrapped?: boolean };
  if (global.__cmpBootstrapped) return;

  const specs: Array<{ role: "admin" | "technician"; email: string; password: string; name: string }> = [];
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    specs.push({ role: "admin", email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: process.env.ADMIN_NAME || "Admin" });
  }
  if (process.env.TECH_EMAIL && process.env.TECH_PASSWORD) {
    specs.push({ role: "technician", email: process.env.TECH_EMAIL, password: process.env.TECH_PASSWORD, name: process.env.TECH_NAME || "Technician" });
  }
  if (specs.length === 0) {
    global.__cmpBootstrapped = true;
    return;
  }

  try {
    const { default: User } = await import("@/models/User");
    for (const spec of specs) {
      const existing = await User.findOne({ email: spec.email.toLowerCase().trim() });
      if (existing) continue;
      await User.create({
        name: spec.name,
        email: spec.email,
        phone: "",
        passwordHash: spec.password,
        role: spec.role,
      });
      console.log(`[bootstrap] created ${spec.role} account: ${spec.email}`);
    }
  } catch (err) {
    console.error("[bootstrap] failed:", err);
  } finally {
    global.__cmpBootstrapped = true;
  }
}
