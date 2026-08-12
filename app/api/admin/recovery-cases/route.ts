import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "../../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  if (!(await verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const adminKey = process.env.ADMIN_DATA_SECRET;
  if (!url || !adminKey) {
    return NextResponse.json({ error: "Data service unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch(`${url}/functions/v1/recovery-cases`, {
      headers: { "x-admin-data-key": adminKey },
      cache: "no-store",
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Data service unavailable" }, { status: 503 });
  }
}
