import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { buildRecoveryCaseRecord } from "./model.ts";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-data-key",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

const adminDataKeyHash = "fdbe344d15fb255aed69e94cf2b733dbf9fb4d80a44caa529b3b93a57233b398";
const adminFields = [
  "id", "submitted_at", "machine_type", "machine_type_other", "first_report_source", "first_report_source_other",
  "information_sufficient", "information_available", "information_available_other", "first_action", "first_action_other",
  "first_action_effectiveness", "time_to_right_way_forward", "recovery_requirements", "recovery_requirements_other",
  "total_downtime", "biggest_time_loss", "biggest_time_loss_other", "breakdown_frequency",
  "most_helpful_next_breakdown", "most_helpful_next_breakdown_other", "role", "role_other", "trial_interest",
  "contact_name", "company", "contact_details", "wants_findings", "findings_email", "findings_requested_at",
  "source", "schema_version",
].join(",");

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function validUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function createFindingsToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    if (request.method === "GET" || request.method === "DELETE") {
      const suppliedKeyHash = await sha256Hex(request.headers.get("x-admin-data-key") ?? "");
      if (!safeEqual(suppliedKeyHash, adminDataKeyHash)) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    if (request.method === "GET") {
      const { data, error, count } = await supabase
        .from("recovery_cases")
        .select(adminFields, { count: "exact" })
        .order("submitted_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return Response.json({ cases: data, total: count ?? data.length }, { headers });
    }

    if (request.method === "DELETE") {
      const body = await request.json();
      if (!validUuid(body.id)) return Response.json({ error: "Invalid Recovery Case ID" }, { status: 400, headers });
      const { data, error } = await supabase.from("recovery_cases").delete().eq("id", body.id).select("id").maybeSingle();
      if (error) throw error;
      if (!data) return Response.json({ error: "Recovery Case not found" }, { status: 404, headers });
      return Response.json({ deleted: data.id }, { headers });
    }

    if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers });

    const body = await request.json() as Record<string, unknown>;
    const { record, valid } = buildRecoveryCaseRecord(body);

    if (!valid) return Response.json({ error: "Please complete all required answers." }, { status: 400, headers });

    const findingsToken = createFindingsToken();
    const findingsTokenHash = await sha256Hex(findingsToken);
    const { data, error } = await supabase
      .from("recovery_cases")
      .insert({ ...record, findings_token_hash: findingsTokenHash })
      .select("id, submitted_at")
      .single();
    if (error) throw error;
    return Response.json({ response: data, findings_token: findingsToken, schema_version: 2 }, { status: 201, headers });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to save this response right now." }, { status: 500, headers });
  }
});
