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

export const industrialEnglishAnswers = {
  role_v1: ["Service Manager / Service Controller", "Engineer / Technician", "Fleet / Operations", "Hire Desk / Branch", "Owner / Director", "Manufacturer / OEM", "Other"],
  fleet_size: ["Under 50 machines", "50–249", "250–999", "1,000+", "Not applicable", "Prefer not to say"],
  delay_frequency: ["Most days", "A few times a week", "About once a week", "A few times a month", "Less often", "Hard to say"],
  machine_type_v1: ["Scissor lift", "Boom lift", "Other", "Not sure"],
  main_delay: ["Getting the right information from site", "Working out what was actually wrong", "Finding the right engineer", "Waiting for an engineer to become available", "Identifying the right part", "Waiting for the part", "Waiting for manufacturer / OEM support", "Arranging transport", "Finding a replacement / cross-hire machine", "Communication / coordination", "Something else"],
  other_delays: ["Getting the right information from site", "Working out what was actually wrong", "Finding the right engineer", "Waiting for an engineer to become available", "Identifying the right part", "Waiting for the part", "Waiting for manufacturer / OEM support", "Arranging transport", "Finding a replacement / cross-hire machine", "Communication / coordination", "No — that was the main issue", "Something else"],
  additional_resources_needed: ["Yes", "No", "Not sure"],
  additional_resources: ["Engineer", "Manufacturer / OEM support", "Technical advice", "Part(s)", "Transport", "Replacement / cross-hire machine", "Other"],
  resource_source: ["Another depot / branch", "Manufacturer / OEM", "Existing supplier", "Independent engineer", "Another rental company", "Other"],
  resource_arrangement: ["Someone we already knew", "Phone", "WhatsApp / messaging", "Internal system", "Manufacturer / supplier portal", "Online search", "Other"],
  time_to_resource: ["Under 30 minutes", "30–60 minutes", "1–2 hours", "2–4 hours", "More than 4 hours", "Next day or longer", "Can't remember"],
  current_recovery_method: ["Very well", "Fairly well", "It's mixed", "Not very well", "Poorly"],
  recovery_outcome: ["We fixed the original machine", "Remote fix / operator action", "Replacement from our own fleet", "Cross-hire / machine from another rental company", "They used another machine already on site", "They waited for the original machine to be repaired", "Other", "Don't know"],
  avoidable_time: ["Yes", "Probably", "No", "Not sure"],
  biggest_difference: ["Better information from site", "Knowing the fault sooner", "Knowing who to contact", "Getting an engineer sooner", "Getting the right part sooner", "Faster manufacturer / OEM support", "Getting a replacement machine sooner", "Better communication / coordination", "Something else"],
  customer_working_time_lost: ["Under 1 hour", "1–2 hours", "2–4 hours", "4–8 hours", "About a day", "More than a day", "They kept working with a replacement machine", "Don't know"],
  findings_preference: ["Yes", "No"],
  follow_up_chat: ["Yes", "Maybe", "No"],
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

function allowedIndustrial(key: keyof typeof industrialEnglishAnswers, value: string) {
  return (industrialEnglishAnswers[key] as readonly string[]).includes(value);
}

function allowedList(key: "information_available" | "recovery_requirements", value: unknown) {
  if (!Array.isArray(value)) return null;
  const cleaned = [...new Set(value.map((item) => clean(item, 100)).filter(Boolean))];
  return cleaned.length > 0 && cleaned.every((item) => allowed(key, item)) ? cleaned : null;
}

function allowedIndustrialList(key: "other_delays" | "additional_resources", value: unknown) {
  if (!Array.isArray(value)) return null;
  const cleaned = [...new Set(value.map((item) => clean(item, 100)).filter(Boolean))];
  return cleaned.length > 0 && cleaned.every((item) => allowedIndustrial(key, item)) ? cleaned : null;
}

function mapRole(value: string) {
  if (value === "Service Manager / Service Controller") return "Service Manager / Controller";
  if (value === "Engineer / Technician") return "Engineer";
  if (value === "Fleet / Operations") return "Fleet / Operations";
  if (value === "Hire Desk / Branch") return "Hire desk / Rental";
  return "Other";
}

function mapMachine(value: string) {
  if (value === "Scissor lift") return "Scissor";
  if (value === "Boom lift") return "Boom";
  return "Other / Not sure";
}

function mapMainDelay(value: string) {
  const mapped: Record<string, string> = {
    "Getting the right information from site": "Getting the right information",
    "Working out what was actually wrong": "Working out the fault",
    "Finding the right engineer": "Waiting for an engineer",
    "Waiting for an engineer to become available": "Waiting for an engineer",
    "Identifying the right part": "Finding the right part",
    "Waiting for the part": "Waiting for the part",
    "Waiting for manufacturer / OEM support": "Waiting for manufacturer/OEM support",
    "Arranging transport": "Transport",
    "Finding a replacement / cross-hire machine": "Finding another machine",
    "Communication / coordination": "Communication / approval",
  };
  return mapped[value] || "Other";
}

function mapDowntime(value: string) {
  const mapped: Record<string, string> = {
    "Under 1 hour": "Under 1 hour",
    "1–2 hours": "1–4 hours",
    "2–4 hours": "1–4 hours",
    "4–8 hours": "4–8 hours",
    "About a day": "8–24 hours",
    "More than a day": "1–2 days",
  };
  return mapped[value] || "Not sure";
}

function mapRequirements(values: string[] | null) {
  if (!values) return ["Other"];
  const mapped = values.map((value) => ({
    Engineer: "Engineer visit",
    "Manufacturer / OEM support": "Manufacturer/OEM support",
    "Part(s)": "Part(s)",
    Transport: "Transport",
    "Replacement / cross-hire machine": "Replacement machine / cross-hire",
  })[value] || "Other");
  return [...new Set(mapped)];
}

function mapHelpful(value: string) {
  const mapped: Record<string, string> = {
    "Better information from site": "Better information from site",
    "Knowing the fault sooner": "Knowing the likely fault sooner",
    "Knowing who to contact": "Knowing the best next step",
    "Getting an engineer sooner": "Finding the right engineer",
    "Getting the right part sooner": "Finding the right part",
    "Getting a replacement machine sooner": "Finding another machine quickly",
  };
  return mapped[value] || "Other";
}

function buildIndustrialEnglishRecord(body: Record<string, unknown>) {
  const additionalResourcesNeeded = clean(body.additional_resources_needed);
  const additionalResources = additionalResourcesNeeded === "Yes" ? allowedIndustrialList("additional_resources", body.additional_resources) : null;
  const avoidableTime = clean(body.avoidable_time);
  const biggestDifference = avoidableTime === "Yes" || avoidableTime === "Probably" ? clean(body.biggest_difference) : null;
  const followUpChat = clean(body.follow_up_chat);
  const legacyTrialInterest = followUpChat === "Yes" ? "Yes — happy to try it" : followUpChat === "Maybe" ? "Maybe — tell me more" : "Not at the moment";
  const exactContact = optional(body.contact_details, 254);
  const machineType = clean(body.machine_type_v1);
  const mainDelay = clean(body.main_delay);
  const customerWorkingTimeLost = clean(body.customer_working_time_lost);
  const studyRole = clean(body.role_v1);
  const tomorrowEasier = clean(body.tomorrow_easier, 1000);
  const requirements = mapRequirements(additionalResources);

  const record = {
    questionnaire_version: "uk_industrial_english_v1",
    study_role: studyRole,
    study_role_other: optional(body.role_v1_other, 160),
    fleet_size: clean(body.fleet_size),
    delay_frequency: clean(body.delay_frequency),
    study_machine_type: machineType,
    study_machine_type_other: optional(body.machine_type_v1_other, 160),
    main_delay: mainDelay,
    main_delay_other: optional(body.main_delay_other, 160),
    other_delays: allowedIndustrialList("other_delays", body.other_delays),
    other_delays_other: optional(body.other_delays_other, 160),
    additional_resources_needed: additionalResourcesNeeded,
    additional_resources: additionalResources,
    additional_resources_other: additionalResourcesNeeded === "Yes" ? optional(body.additional_resources_other, 160) : null,
    resource_source: additionalResourcesNeeded === "Yes" ? optional(body.resource_source, 100) : null,
    resource_source_other: additionalResourcesNeeded === "Yes" ? optional(body.resource_source_other, 160) : null,
    resource_arrangement: additionalResourcesNeeded === "Yes" ? optional(body.resource_arrangement, 100) : null,
    resource_arrangement_other: additionalResourcesNeeded === "Yes" ? optional(body.resource_arrangement_other, 160) : null,
    time_to_resource: additionalResourcesNeeded === "Yes" ? optional(body.time_to_resource, 100) : null,
    current_recovery_method: clean(body.current_recovery_method),
    recovery_outcome: clean(body.recovery_outcome),
    recovery_outcome_other: optional(body.recovery_outcome_other, 160),
    avoidable_time: avoidableTime,
    biggest_difference: biggestDifference,
    biggest_difference_other: biggestDifference ? optional(body.biggest_difference_other, 160) : null,
    customer_working_time_lost: customerWorkingTimeLost,
    tomorrow_easier: tomorrowEasier,
    findings_preference: clean(body.findings_preference),
    follow_up_chat: followUpChat,
    follow_up_contact_details: exactContact,

    machine_type: mapMachine(machineType),
    machine_type_other: machineType === "Other" ? optional(body.machine_type_v1_other, 160) : null,
    first_report_source: "Other",
    first_report_source_other: "Not asked in UK Industrial English V1.0",
    information_sufficient: "Partly",
    information_available: ["Other"],
    information_available_other: "Not asked in UK Industrial English V1.0",
    first_action: "Other",
    first_action_other: "Not asked in UK Industrial English V1.0",
    first_action_effectiveness: "Not sure",
    time_to_right_way_forward: "Not sure",
    recovery_requirements: requirements,
    recovery_requirements_other: requirements.includes("Other") ? "See UK Industrial English V1.0 answers" : null,
    total_downtime: mapDowntime(customerWorkingTimeLost),
    biggest_time_loss: mapMainDelay(mainDelay),
    biggest_time_loss_other: mainDelay === "Something else" ? optional(body.main_delay_other, 160) : null,
    breakdown_frequency: clean(body.delay_frequency) === "Hard to say" ? "Less often" : clean(body.delay_frequency),
    most_helpful_next_breakdown: mapHelpful(biggestDifference || ""),
    most_helpful_next_breakdown_other: mapHelpful(biggestDifference || "") === "Other" ? optional(biggestDifference ? body.biggest_difference_other : tomorrowEasier, 160) || "See final open response" : null,
    role: mapRole(studyRole),
    role_other: mapRole(studyRole) === "Other" ? optional(body.role_v1_other, 160) || studyRole : null,
    trial_interest: legacyTrialInterest,
    contact_name: null,
    company: null,
    contact_details: legacyTrialInterest === "Not at the moment" ? null : exactContact,
  };

  const resourceDetailsValid = additionalResourcesNeeded !== "Yes" || (
    !!additionalResources &&
    allowedIndustrial("resource_source", record.resource_source || "") &&
    allowedIndustrial("resource_arrangement", record.resource_arrangement || "") &&
    allowedIndustrial("time_to_resource", record.time_to_resource || "")
  );
  const avoidableDetailsValid = avoidableTime === "Yes" || avoidableTime === "Probably"
    ? !!biggestDifference && allowedIndustrial("biggest_difference", biggestDifference)
    : biggestDifference === null;
  const otherDelays = record.other_delays;
  const exclusiveDelayValid = !!otherDelays && (!otherDelays.includes("No — that was the main issue") || otherDelays.length === 1);
  const valid =
    clean(body.questionnaire_version) === "uk_industrial_english_v1" &&
    allowedIndustrial("role_v1", record.study_role) &&
    allowedIndustrial("fleet_size", record.fleet_size) &&
    allowedIndustrial("delay_frequency", record.delay_frequency) &&
    allowedIndustrial("machine_type_v1", record.study_machine_type) &&
    allowedIndustrial("main_delay", record.main_delay) &&
    !!otherDelays && exclusiveDelayValid &&
    allowedIndustrial("additional_resources_needed", record.additional_resources_needed) && resourceDetailsValid &&
    allowedIndustrial("current_recovery_method", record.current_recovery_method) &&
    allowedIndustrial("recovery_outcome", record.recovery_outcome) &&
    allowedIndustrial("avoidable_time", record.avoidable_time) && avoidableDetailsValid &&
    allowedIndustrial("customer_working_time_lost", record.customer_working_time_lost) &&
    record.tomorrow_easier.length > 0 &&
    allowedIndustrial("findings_preference", record.findings_preference) &&
    allowedIndustrial("follow_up_chat", record.follow_up_chat);

  return { record, valid };
}

export function buildRecoveryCaseRecord(body: Record<string, unknown>) {
  if (clean(body.questionnaire_version) === "uk_industrial_english_v1") {
    return buildIndustrialEnglishRecord(body);
  }
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
