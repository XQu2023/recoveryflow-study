import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { buildFindingsRequest } from "./model.ts";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

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

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers });

  try {
    const body = await request.json() as Record<string, unknown>;
    const findings = buildFindingsRequest(body);
    if (!findings.payloadValid) return Response.json({ error: "Invalid request." }, { status: 400, headers });
    if (!findings.emailValid) return Response.json({ error: "Enter a valid email address." }, { status: 400, headers });
    if (!findings.capabilityValid) return Response.json({ error: "Unable to register findings interest." }, { status: 404, headers });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const tokenHash = await sha256Hex(findings.token);
    const { data: existing, error: lookupError } = await supabase
      .from("recovery_cases")
      .select("id, findings_token_hash, wants_findings, findings_email, findings_requested_at")
      .eq("id", findings.responseId)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!existing?.findings_token_hash || !safeEqual(tokenHash, existing.findings_token_hash)) {
      return Response.json({ error: "Unable to register findings interest." }, { status: 404, headers });
    }

    const requestedAt = existing.findings_requested_at ?? new Date().toISOString();
    const { data, error } = await supabase
      .from("recovery_cases")
      .update({
        wants_findings: true,
        findings_email: findings.email,
        findings_requested_at: requestedAt,
      })
      .eq("id", findings.responseId)
      .eq("findings_token_hash", tokenHash)
      .select("id, wants_findings, findings_email, findings_requested_at")
      .single();
    if (error) throw error;

    return Response.json({ response: data }, { headers });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to register findings interest." }, { status: 500, headers });
  }
});
