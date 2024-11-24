import { ServerResponse } from "http";
import { undefined } from "./cors";

export function putCorsHeaders(
  response: ServerResponse,
  headers: Record<string, string | undefined>
): void {
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      response.setHeader(key, value);
    }
  }
}
