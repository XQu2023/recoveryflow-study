import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "../../../../lib/admin-auth";

export const dynamic = "force-dynamic";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

function dataService() {
  const url = process.env.SUPABASE_URL;
  const adminKey = process.env.ADMIN_DATA_SECRET;
  return url && adminKey ? { url, adminKey } : null;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = dataService();
  if (!service) {
    return NextResponse.json({ error: "Data service unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch(`${service.url}/functions/v1/contributors`, {
      headers: { "x-admin-data-key": service.adminKey },
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

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let id: unknown;
  try {
    id = (await request.json()).id;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (typeof id !== "string" || !uuidPattern.test(id)) {
    return NextResponse.json({ error: "Invalid Contributor ID" }, { status: 400 });
  }

  const service = dataService();
  if (!service) {
    return NextResponse.json({ error: "Data service unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch(`${service.url}/functions/v1/contributors`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-data-key": service.adminKey },
      body: JSON.stringify({ id }),
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
