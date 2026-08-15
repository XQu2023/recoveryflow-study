import assert from "node:assert/strict";
import test from "node:test";
import { buildRecoveryCaseRecord } from "../supabase/functions/recovery-cases/model.ts";

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
