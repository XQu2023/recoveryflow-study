import assert from "node:assert/strict";
import test from "node:test";
import { buildRecoveryCaseRecord, industrialEnglishAnswers } from "../supabase/functions/recovery-cases/model.ts";

const completeResponse = {
  machine_type: "Boom",
  first_report_source: "Operator / site contact",
  information_sufficient: "Partly",
  information_available: ["Description of the problem", "Fault code"],
  first_action: "Remote checks with the operator/customer",
  first_action_effectiveness: "Partly",
  time_to_right_way_forward: "30–60 mins",
  recovery_requirements: ["Engineer visit", "Part(s)"],
  total_downtime: "4–8 hours",
  biggest_time_loss: "Working out the fault",
  breakdown_frequency: "A few times a week",
  most_helpful_next_breakdown: "Knowing the likely fault sooner",
  role: "Service Manager / Controller",
  trial_interest: "Yes — happy to try it",
  contact_name: "Local Test",
  company: "RecoveryFlow Test",
  contact_details: "local@example.test",
};

const industrialEnglishResponse = {
  questionnaire_version: "uk_industrial_english_v1",
  role_v1: "Service Manager / Service Controller",
  fleet_size: "250–999",
  delay_frequency: "A few times a week",
  machine_type_v1: "Boom lift",
  main_delay: "Waiting for the part",
  other_delays: ["Communication / coordination"],
  additional_resources_needed: "Yes",
  additional_resources: ["Engineer", "Part(s)"],
  resource_source: "Existing supplier",
  resource_arrangement: "Phone",
  time_to_resource: "1–2 hours",
  current_recovery_method: "It's mixed",
  recovery_outcome: "We fixed the original machine",
  avoidable_time: "Probably",
  biggest_difference: "Getting the right part sooner",
  customer_working_time_lost: "4–8 hours",
  tomorrow_easier: "A confirmed part number and availability at the first call.",
  findings_preference: "Yes",
  follow_up_chat: "Maybe",
  contact_details: "study-test@example.test",
};

test("accepts one complete structured MEWP breakdown response", () => {
  const result = buildRecoveryCaseRecord(completeResponse);
  assert.equal(result.valid, true);
  assert.deepEqual(result.record.information_available, ["Description of the problem", "Fault code"]);
  assert.deepEqual(result.record.recovery_requirements, ["Engineer visit", "Part(s)"]);
  assert.equal(result.record.contact_details, "local@example.test");
});

test("removes contact data when future trial interest is declined", () => {
  const result = buildRecoveryCaseRecord({ ...completeResponse, trial_interest: "Not at the moment" });
  assert.equal(result.valid, true);
  assert.equal(result.record.contact_name, null);
  assert.equal(result.record.company, null);
  assert.equal(result.record.contact_details, null);
});

test("rejects missing or unknown required answers", () => {
  assert.equal(buildRecoveryCaseRecord({ ...completeResponse, information_available: [] }).valid, false);
  assert.equal(buildRecoveryCaseRecord({ ...completeResponse, total_downtime: "Immediately" }).valid, false);
});

test("stores every UK Industrial English V1.0 answer without changing the legacy contract", () => {
  const result = buildRecoveryCaseRecord(industrialEnglishResponse);
  assert.equal(result.valid, true);
  assert.equal(result.record.questionnaire_version, "uk_industrial_english_v1");
  assert.equal(result.record.study_role, "Service Manager / Service Controller");
  assert.equal(result.record.study_machine_type, "Boom lift");
  assert.deepEqual(result.record.other_delays, ["Communication / coordination"]);
  assert.deepEqual(result.record.additional_resources, ["Engineer", "Part(s)"]);
  assert.equal(result.record.tomorrow_easier, "A confirmed part number and availability at the first call.");
  assert.equal(result.record.findings_preference, "Yes");
  assert.equal(result.record.follow_up_chat, "Maybe");
  assert.equal(result.record.follow_up_contact_details, "study-test@example.test");
  assert.equal(result.record.machine_type, "Boom");
  assert.equal(result.record.trial_interest, "Maybe — tell me more");
});

test("omits resource and avoidable-time branches when their conditions are not met", () => {
  const result = buildRecoveryCaseRecord({
    ...industrialEnglishResponse,
    additional_resources_needed: "No",
    additional_resources: ["Engineer"],
    resource_source: "Existing supplier",
    resource_arrangement: "Phone",
    time_to_resource: "1–2 hours",
    avoidable_time: "No",
    biggest_difference: "Getting the right part sooner",
    follow_up_chat: "No",
  });
  assert.equal(result.valid, true);
  assert.equal(result.record.additional_resources, null);
  assert.equal(result.record.resource_source, null);
  assert.equal(result.record.biggest_difference, null);
  assert.equal(result.record.contact_details, null);
  assert.equal(result.record.follow_up_contact_details, "study-test@example.test");
});

test("rejects incomplete conditionals, mixed exclusive delays, and missing free text", () => {
  assert.equal(buildRecoveryCaseRecord({ ...industrialEnglishResponse, resource_source: undefined }).valid, false);
  assert.equal(buildRecoveryCaseRecord({ ...industrialEnglishResponse, biggest_difference: undefined }).valid, false);
  assert.equal(buildRecoveryCaseRecord({ ...industrialEnglishResponse, other_delays: ["No — that was the main issue", "Waiting for the part"] }).valid, false);
  assert.equal(buildRecoveryCaseRecord({ ...industrialEnglishResponse, tomorrow_easier: "" }).valid, false);
});

test("accepts every frozen option in its applicable questionnaire branch", () => {
  const listFields = new Set(["other_delays", "additional_resources"]);
  for (const [key, options] of Object.entries(industrialEnglishAnswers)) {
    for (const option of options) {
      const response = { ...industrialEnglishResponse, [key]: listFields.has(key) ? [option] : option };
      if (key === "additional_resources_needed" && option !== "Yes") {
        delete response.additional_resources;
        delete response.resource_source;
        delete response.resource_arrangement;
        delete response.time_to_resource;
      }
      if (key === "avoidable_time" && option !== "Yes" && option !== "Probably") {
        delete response.biggest_difference;
      }
      assert.equal(buildRecoveryCaseRecord(response).valid, true, `${key}: ${option}`);
    }
  }
});
