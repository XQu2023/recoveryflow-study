import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const allowedInterests = [
  "Share real experiences",
  "Share practical knowledge",
  "Take part in interviews or studies",
  "Join industry discussions",
  "Make useful introductions",
  "Not sure yet — keep me informed",
] as const;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-data-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

const adminDataKeyHash = "fdbe344d15fb255aed69e94cf2b733dbf9fb4d80a44caa529b3b93a57233b398";

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function clean(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optional(value: unknown, max = 500) {
  const result = clean(value, max);
  return result || null;
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    if (request.method === "GET") {
      const suppliedKeyHash = await sha256Hex(request.headers.get("x-admin-data-key") ?? "");
      if (!safeEqual(suppliedKeyHash, adminDataKeyHash)) {
        return Response.json({ error: "Unauthorized" }, { status: 401, headers });
      }
      const { data, error, count } = await supabase
        .from("contributors")
        .select("*", { count: "exact" })
        .order("joined_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return Response.json({ contributors: data, total: count ?? data.length }, { headers });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers });
    }

    const body = await request.json();
    const contributionInterests = Array.isArray(body.contribution_interests)
      ? [...new Set(body.contribution_interests.map((value: unknown) => clean(value, 80)).filter(Boolean))]
      : [];
    const record = {
      full_name: clean(body.full_name),
      company: clean(body.company),
      role: clean(body.role),
      email: clean(body.email, 254).toLowerCase(),
      linkedin: optional(body.linkedin),
      contribution_interests: contributionInterests,
      consent: body.consent === true,
      status: "active",
    };

    const valid =
      record.full_name.length > 0 &&
      record.company.length > 0 &&
      record.role.length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email) &&
      record.contribution_interests.length > 0 &&
      record.contribution_interests.every((value) => (allowedInterests as readonly string[]).includes(value)) &&
      record.consent;

    if (!valid) {
      return Response.json({ error: "Please complete all required fields and confirm your consent." }, { status: 400, headers });
    }

    const { data, error } = await supabase
      .from("contributors")
      .insert(record)
      .select("id, joined_at")
      .single();

    if (error?.code === "23505") {
      return Response.json({ error: "This email is already registered with the RecoveryFlow contributor network." }, { status: 409, headers });
    }
    if (error) throw error;

    return Response.json({ contributor: data }, { status: 201, headers });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "We couldn’t save your details right now. Please try again." }, { status: 500, headers });
  }
});
