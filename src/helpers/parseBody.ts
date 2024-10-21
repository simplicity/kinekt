// TODO do this with a middleware?

import type { Result } from "./types.ts";

export async function parseBody(
  carrier: Request | Response
): Promise<Result<any, string>> {
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
    };
  }
}
