export const allowedAnswers = {
  machine_type: ["Boom", "Scissor", "Vertical mast", "Other / Not sure"],
  first_report_source: ["Operator / site contact", "Hire desk", "Engineer", "Telematics / remote alert", "Other"],
  information_sufficient: ["Yes", "Partly", "No"],
  information_available: ["Description of the problem", "Fault code", "Photos / video", "Machine details", "Service / breakdown history", "Telematics / remote data", "Other"],
  first_action: ["Remote checks with the operator/customer", "Sent / arranged an engineer", "Contacted the manufacturer/OEM", "Checked / arranged a part", "Arranged another machine", "Asked for more information", "Other"],
  first_action_effectiveness: ["Yes", "Partly", "No — we had to change approach", "Not sure"],
  time_to_right_way_forward: ["Under 15 mins", "15–30 mins", "30–60 mins", "1–2 hours", "2–4 hours", "4+ hours", "Not sure"],
  recovery_requirements: ["Remote fix", "Engineer visit", "Another engineer visit", "Part(s)", "Manufacturer/OEM support", "Replacement machine / cross-hire", "Transport", "Other"],
  total_downtime: ["Under 1 hour", "1–4 hours", "4–8 hours", "8–24 hours", "1–2 days", "3+ days", "Not sure"],
  biggest_time_loss: ["Getting the right information", "Working out the fault", "Waiting for an engineer", "Finding the right part", "Waiting for the part", "Waiting for manufacturer/OEM support", "Finding another machine", "Transport", "Communication / approval", "Nowhere in particular — it went smoothly", "Other"],
  breakdown_frequency: ["Most days", "A few times a week", "About once a week", "A few times a month", "Less often"],
  most_helpful_next_breakdown: ["Better information from site", "Knowing the likely fault sooner", "Knowing the best next step", "Finding the right engineer", "Finding the right part", "Finding another machine quickly", "Seeing how similar breakdowns were fixed before", "Nothing in particular", "Other"],
  role: ["Service Manager / Controller", "Engineer", "Hire desk / Rental", "Fleet / Operations", "Other"],
  trial_interest: ["Yes — happy to try it", "Maybe — tell me more", "Not at the moment"],
} as const;

function clean(value: unknown, max = 320) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optional(value: unknown, max = 320) {
  return clean(value, max) || null;
}

function allowed(key: keyof typeof allowedAnswers, value: string) {
  return (allowedAnswers[key] as readonly string[]).includes(value);
}

function allowedList(key: "information_available" | "recovery_requirements", value: unknown) {
  if (!Array.isArray(value)) return null;
  const cleaned = [...new Set(value.map((item) => clean(item, 100)).filter(Boolean))];
  return cleaned.length > 0 && cleaned.every((item) => allowed(key, item)) ? cleaned : null;
}

export function buildRecoveryCaseRecord(body: Record<string, unknown>) {
  const trialInterest = clean(body.trial_interest);
  const acceptsFollowUp = trialInterest === "Yes — happy to try it" || trialInterest === "Maybe — tell me more";
  const record = {
    machine_type: clean(body.machine_type),
    machine_type_other: optional(body.machine_type_other, 160),
    first_report_source: clean(body.first_report_source),
    first_report_source_other: optional(body.first_report_source_other, 160),
    information_sufficient: clean(body.information_sufficient),
    information_available: allowedList("information_available", body.information_available),
    information_available_other: optional(body.information_available_other, 160),
    first_action: clean(body.first_action),
    first_action_other: optional(body.first_action_other, 160),
    first_action_effectiveness: clean(body.first_action_effectiveness),
    time_to_right_way_forward: clean(body.time_to_right_way_forward),
    recovery_requirements: allowedList("recovery_requirements", body.recovery_requirements),
    recovery_requirements_other: optional(body.recovery_requirements_other, 160),
    total_downtime: clean(body.total_downtime),
    biggest_time_loss: clean(body.biggest_time_loss),
    biggest_time_loss_other: optional(body.biggest_time_loss_other, 160),
    breakdown_frequency: clean(body.breakdown_frequency),
    most_helpful_next_breakdown: clean(body.most_helpful_next_breakdown),
    most_helpful_next_breakdown_other: optional(body.most_helpful_next_breakdown_other, 160),
    role: clean(body.role),
    role_other: optional(body.role_other, 160),
    trial_interest: trialInterest,
    contact_name: acceptsFollowUp ? optional(body.contact_name, 160) : null,
    company: acceptsFollowUp ? optional(body.company, 160) : null,
    contact_details: acceptsFollowUp ? optional(body.contact_details, 254) : null,
  };

  const valid =
    allowed("machine_type", record.machine_type) &&
    allowed("first_report_source", record.first_report_source) &&
    allowed("information_sufficient", record.information_sufficient) &&
    !!record.information_available &&
    allowed("first_action", record.first_action) &&
    allowed("first_action_effectiveness", record.first_action_effectiveness) &&
    allowed("time_to_right_way_forward", record.time_to_right_way_forward) &&
    !!record.recovery_requirements &&
    allowed("total_downtime", record.total_downtime) &&
    allowed("biggest_time_loss", record.biggest_time_loss) &&
    allowed("breakdown_frequency", record.breakdown_frequency) &&
    allowed("most_helpful_next_breakdown", record.most_helpful_next_breakdown) &&
    allowed("role", record.role) &&
    allowed("trial_interest", record.trial_interest);

  return { record, valid };
}
