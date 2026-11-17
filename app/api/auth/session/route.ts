import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await readSession();
  return NextResponse.json(user ? { authenticated: true, user } : { authenticated: false }, {
    headers: { "Cache-Control": "no-store" },
  });
}
