import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, createAdminSession, verifyAdminPassword } from "../../../../lib/admin-auth";

export async function POST(request: NextRequest) {
  let password: unknown;
  try {
    password = (await request.json()).password;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return response;
}
