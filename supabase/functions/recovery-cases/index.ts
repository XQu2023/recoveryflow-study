import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const allowedAnswers = {
  role: ["Fleet Manager", "Service Manager", "Engineer", "Rental Company", "Manufacturer", "Supplier", "Other"],
  stop_reason: ["Battery", "Hydraulic", "Electrical", "Engine", "Controls", "Safety system", "Unknown", "Other"],
  warning_signs: ["Yes", "No", "Not sure"],
  biggest_delay: ["Finding the fault", "Confirming the cause", "Waiting for parts", "Waiting for an engineer", "Approval", "Repair", "Testing", "Other"],
  recovery_help: ["Replaced parts", "Engineer experience", "Manufacturer support", "Technical information", "Remote support", "Temporary repair", "Other"],
  improvement: ["Prevent breakdowns", "Find faults faster", "Better technical information", "Faster parts", "Better training", "Better support", "Better communication", "Other"],
} as const;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

function clean(value: unknown, max = 320) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optional(value: unknown, max = 320) {
  const result = clean(value, max);
  return result || null;
}

function allowed(key: keyof typeof allowedAnswers, value: string) {
  return (allowedAnswers[key] as readonly string[]).includes(value);
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
      const { data, error, count } = await supabase
        .from("recovery_cases")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return Response.json({ cases: data, total: count ?? data.length }, { headers });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers });
    }

    const body = await request.json();
    const record = {
      role: clean(body.role),
      stop_reason: clean(body.stop_reason),
      stop_reason_other: optional(body.stop_reason_other, 160),
      warning_signs: clean(body.warning_signs),
      warning_signs_detail: optional(body.warning_signs_detail, 160),
      biggest_delay: clean(body.biggest_delay),
      biggest_delay_other: optional(body.biggest_delay_other, 160),
      recovery_help: clean(body.recovery_help),
      recovery_help_other: optional(body.recovery_help_other, 160),
      improvement: clean(body.improvement),
      improvement_other: optional(body.improvement_other, 160),
      full_name: clean(body.full_name, 160),
      company: clean(body.company, 160),
      email: clean(body.email, 254).toLowerCase(),
      linkedin: optional(body.linkedin, 500),
      receive_findings: body.receive_findings === true,
    };

    const valid =
      allowed("role", record.role) &&
      allowed("stop_reason", record.stop_reason) &&
      allowed("warning_signs", record.warning_signs) &&
      allowed("biggest_delay", record.biggest_delay) &&
      allowed("recovery_help", record.recovery_help) &&
      allowed("improvement", record.improvement) &&
      record.full_name.length > 0 &&
      record.company.length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email) &&
      (record.stop_reason !== "Other" || !!record.stop_reason_other) &&
      (record.warning_signs !== "Yes" || !!record.warning_signs_detail) &&
      (record.biggest_delay !== "Other" || !!record.biggest_delay_other) &&
      (record.recovery_help !== "Other" || !!record.recovery_help_other) &&
      (record.improvement !== "Other" || !!record.improvement_other);

    if (!valid) {
      return Response.json({ error: "Please complete all required answers." }, { status: 400, headers });
    }

    const { data, error } = await supabase
      .from("recovery_cases")
      .insert(record)
      .select("id, created_at")
      .single();
    if (error) throw error;

    return Response.json({ case: data }, { status: 201, headers });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to save this contribution right now." }, { status: 500, headers });
  }
});
