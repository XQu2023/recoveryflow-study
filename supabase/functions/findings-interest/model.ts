const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const tokenPattern = /^[A-Za-z0-9_-]{32,128}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normaliseFindingsEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase().slice(0, 254) : "";
}

export function buildFindingsRequest(body: Record<string, unknown>) {
  const allowedKeys = new Set(["response_id", "token", "email"]);
  const responseId = typeof body.response_id === "string" ? body.response_id.trim() : "";
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const email = normaliseFindingsEmail(body.email);

  return {
    responseId,
    token,
    email,
    payloadValid: Object.keys(body).every((key) => allowedKeys.has(key)),
    capabilityValid: uuidPattern.test(responseId) && tokenPattern.test(token),
    emailValid: emailPattern.test(email),
  };
}

export function isValidFindingsEmail(value: unknown) {
  return emailPattern.test(normaliseFindingsEmail(value));
}
