// TODO do this with a middleware?

import type { Result } from "./result.ts";

export async function parseBody(
  carrier: Request | Response
): Promise<Result<any, { text: string }>> {
  // TODO this should be caught, too
  const text = await carrier.text();

  try {
    return {
      type: "ok",
      value: JSON.parse(text),
    };
  } catch {
    return {
      type: "error",
      error: `Tried to parse json, received:\n\n${text}`,
      metadata: { text },
    };
  }
}
