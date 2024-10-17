import { errorResult, okResult, type Result } from "./result";

export function parseJsonFromText(
  text: string
): Result<unknown, "json-parse-error", { text: string }> {
  try {
    return okResult(JSON.parse(text));
  } catch {
    return errorResult(
      "json-parse-error",
      "Tried to parse json, received text.",
      { text }
    );
  }
}
