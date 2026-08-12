import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function endpoint() {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL is not configured");
  return `${url}/functions/v1/recovery-cases`;
}

async function proxy(request: NextRequest, method: "GET" | "POST") {
  try {
    const response = await fetch(endpoint(), {
      method,
      headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: method === "POST" ? await request.text() : undefined,
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

export async function GET(request: NextRequest) {
  return proxy(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxy(request, "POST");
}
