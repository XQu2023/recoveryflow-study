import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function endpoint() {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL is not configured");
  return `${url}/functions/v1/recovery-cases`;
}

async function submit(request: NextRequest) {
  try {
    const response = await fetch(endpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
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

export async function POST(request: NextRequest) {
  return submit(request);
}
