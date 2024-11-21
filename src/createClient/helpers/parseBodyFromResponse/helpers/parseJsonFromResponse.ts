import { parseJsonFromText } from "../../../../helpers/parseJsonFromText";
import { errorResult, type Result } from "../../../../helpers/result";
import type { StatusCode } from "../../../../helpers/types";

export async function parseJsonFromResponse(
  response: Response
): Promise<
  Result<unknown, "body-parse-error", { text: string; statusCode: StatusCode }>
> {
  const text = await response.text();

  const result = parseJsonFromText(text);

  switch (result.type) {
    case "ok": {
      return result;
    }
    case "error": {
      return errorResult("body-parse-error", result.description, {
        text,
        statusCode: response.status as StatusCode,
      });
    }
  }
}
