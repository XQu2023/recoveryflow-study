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

    if (response.ok) {
      let result: unknown;
      try {
        result = JSON.parse(body);
      } catch {
        return NextResponse.json({ error: "Data service returned an invalid response" }, { status: 502 });
      }

      const payload = result as {
        schema_version?: unknown;
        response?: { id?: unknown; submitted_at?: unknown };
      };
      const persisted =
        payload.schema_version === 2 &&
        typeof payload.response?.id === "string" &&
        typeof payload.response?.submitted_at === "string";

      if (!persisted) {
        return NextResponse.json({ error: "Data service did not confirm persistence" }, { status: 502 });
      }
    }

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
