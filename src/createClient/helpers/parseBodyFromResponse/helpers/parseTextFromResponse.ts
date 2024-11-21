import { errorResult, okResult, type Result } from "../../../../helpers/result";
import type { StatusCode } from "../../../../helpers/types";

export async function parseTextFromResponse(
  response: Response
): Promise<Result<unknown, "body-parse-error", { statusCode: StatusCode }>> {
  return response
    .text()
    .then((text) => okResult(text))
    .catch(() =>
      errorResult("body-parse-error", "Could not read text from response.", {
        statusCode: response.status as StatusCode,
      })
    );
}
