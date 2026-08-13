import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "./db";
import User, { type IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];

export const TOKEN_COOKIE = "cmp_token";

export function signToken(user: { _id: unknown }): string {
  return jwt.sign({ sub: String(user._id) }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    return decoded.sub;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<IUser | null> {
  try {
    const store = await cookies();
    const token = store.get(TOKEN_COOKIE)?.value;
    if (!token) return null;
    const userId = verifyToken(token);
    if (!userId) return null;
    await dbConnect();
    const user = await User.findById(userId).lean().exec();
    return (user as unknown as IUser) ?? null;
  } catch {
    return null;
  }
}

export async function requireRoles(
  roles: Array<"technician" | "admin" | "customer">
): Promise<IUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!roles.includes(user.role as "technician" | "admin" | "customer")) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function setAuthCookie(token: string): Promise<void> {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
}
