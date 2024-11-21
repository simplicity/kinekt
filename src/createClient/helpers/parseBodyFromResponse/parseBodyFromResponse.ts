import type { MimeType } from "../../../helpers/MimeType";
import { errorResult, type Result } from "../../../helpers/result";
import type { StatusCode } from "../../../helpers/types";
import { parseJsonFromResponse } from "./helpers/parseJsonFromResponse";
import { parseTextFromResponse } from "./helpers/parseTextFromResponse";

export async function parseBodyFromResponse(
  response: Response
): Promise<
  Result<unknown, "body-parse-error", { text?: string; statusCode: StatusCode }>
> {
  const mimeType = response.headers.get("Content-Type")?.split(";").at(0) as
    | MimeType
    | undefined;

  switch (mimeType) {
    case "application/json": {
      return parseJsonFromResponse(response);
    }
    case "text/html": {
      return parseTextFromResponse(response);
    }
  }

  return errorResult(
    "body-parse-error",
    `Could not parse body due to unsupported mime type '${mimeType}'`,
    { statusCode: response.status as StatusCode }
  );
}
