// TODO do this with a middleware?

import { errorResult, okResult, type Result } from "./result.ts";

export async function parseBody(
  carrier: Request | Response
): Promise<Result<any, "body-parse-error", { text: string }>> {
  // TODO this should be caught, too
  const text = await carrier.text();

  try {
    return okResult(JSON.parse(text));
  } catch {
    return errorResult(
      "body-parse-error",
      "Tried to parse json, received text.",
      { text }
    );
  }
}
