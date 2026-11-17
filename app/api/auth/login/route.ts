import { NextResponse } from "next/server";
import {
  COOKIES,
  DEFAULT_AUTH_API_URL,
  cookieOptions,
  encodeProfile,
  toSafeUser,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 10_000;
const MAX_USERNAME = 100;
const MAX_PASSWORD = 200;

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  // 1. Validate input
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Invalid request body.");
  }
  const { username, password } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.trim().length === 0 ||
    password.length === 0
  ) {
    return fail(400, "Username and password are required.");
  }
  if (username.length > MAX_USERNAME || password.length > MAX_PASSWORD) {
    return fail(400, "Username or password is too long.");
  }

  // 2. Forward to the upstream auth API (no extra body fields)
  const url = process.env.AUTH_API_URL || DEFAULT_AUTH_API_URL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch {
    return fail(502, "The authentication service could not be reached. Please try again.");
  } finally {
    clearTimeout(timer);
  }

  const data: unknown = await upstream.json().catch(() => null);

  // 3. Upstream failure
  if (!upstream.ok) {
    if (upstream.status >= 400 && upstream.status < 500) {
      const message =
        data && typeof (data as { message?: unknown }).message === "string"
          ? (data as { message: string }).message.slice(0, 200)
          : "Invalid username or password.";
      return fail(401, message);
    }
    return fail(502, "The authentication service is unavailable. Please try again later.");
  }

  // 4. Validate the success payload
  const d = (data ?? {}) as Record<string, unknown>;
  const user = toSafeUser(d);
  if (!user || typeof d.accessToken !== "string" || typeof d.refreshToken !== "string") {
    return fail(502, "The authentication service returned an unexpected response.");
  }

  // 5. Tokens go to httpOnly cookies only. The browser only receives the safe profile.
  const res = NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(COOKIES.access, d.accessToken, cookieOptions());
  res.cookies.set(COOKIES.refresh, d.refreshToken, cookieOptions());
  res.cookies.set(COOKIES.profile, encodeProfile(user), cookieOptions());
  return res;
}
