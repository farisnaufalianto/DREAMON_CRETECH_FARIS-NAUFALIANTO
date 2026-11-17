import { cookies } from "next/headers";
import type { SafeUser } from "./types";

export const COOKIES = {
  access: "fn_access_token",
  refresh: "fn_refresh_token",
  profile: "fn_profile",
} as const;

export const DEFAULT_AUTH_API_URL = "https://dummyjson.com/user/login";
export const SESSION_MAX_AGE = 60 * 60; // 1 hour

export function cookieOptions(maxAge: number = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/** Whitelists the profile fields that are safe to send to the browser. */
export function toSafeUser(raw: unknown): SafeUser | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "number" || typeof r.username !== "string") return null;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const image = str(r.image);
  return {
    id: r.id,
    username: r.username,
    firstName: str(r.firstName),
    lastName: str(r.lastName),
    email: str(r.email),
    image: image.startsWith("https://") ? image : "",
  };
}

export function encodeProfile(user: SafeUser): string {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

export function decodeProfile(value: string): SafeUser | null {
  try {
    return toSafeUser(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
  } catch {
    return null;
  }
}

export async function readSession(): Promise<SafeUser | null> {
  const jar = await cookies();
  const access = jar.get(COOKIES.access)?.value;
  const profile = jar.get(COOKIES.profile)?.value;
  if (!access || !profile) return null;
  return decodeProfile(profile);
}
