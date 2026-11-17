import { NextResponse } from "next/server";
import { COOKIES, cookieOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  for (const name of Object.values(COOKIES)) {
    res.cookies.set(name, "", cookieOptions(0));
  }
  return res;
}
