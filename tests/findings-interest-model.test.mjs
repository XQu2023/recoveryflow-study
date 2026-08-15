import assert from "node:assert/strict";
import test from "node:test";
import { buildFindingsRequest, isValidFindingsEmail } from "../supabase/functions/findings-interest/model.ts";

const validRequest = {
  response_id: "123e4567-e89b-42d3-a456-426614174000",
  token: "A_secure-capability_token_1234567890abcd",
  email: "Service.Manager@Example.co.uk",
};

test("accepts a response-bound findings request and normalises its email", () => {
  const result = buildFindingsRequest(validRequest);
  assert.equal(result.capabilityValid, true);
  assert.equal(result.emailValid, true);
  assert.equal(result.email, "service.manager@example.co.uk");
});

test("rejects invalid email addresses", () => {
  assert.equal(isValidFindingsEmail("engineer@"), false);
  assert.equal(buildFindingsRequest({ ...validRequest, email: "not-an-email" }).emailValid, false);
});

test("rejects forged response identifiers and short tokens", () => {
  assert.equal(buildFindingsRequest({ ...validRequest, response_id: "not-a-response" }).capabilityValid, false);
  assert.equal(buildFindingsRequest({ ...validRequest, token: "short" }).capabilityValid, false);
});

test("rejects attempts to send survey answer fields through the findings endpoint", () => {
  const result = buildFindingsRequest({ ...validRequest, machine_type: "Scissor" });
  assert.equal(result.payloadValid, false);
});
