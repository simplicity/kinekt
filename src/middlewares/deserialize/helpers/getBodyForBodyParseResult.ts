import { frameworkSpecificResponseBody } from "../../../helpers/frameworkSpecificResponseBody";
import { ErrorResult } from "../../../helpers/result";

export function getBodyForBodyParseResult(
  bodyParseResult:
    | ErrorResult<"unsupported-mime-type", { mimeType: string | undefined }>
    | ErrorResult<"json-parse-error", { text: string }>
) {
  switch (bodyParseResult.code) {
    case "unsupported-mime-type": {
      return frameworkSpecificResponseBody(
        bodyParseResult.code,
        bodyParseResult.description
      );
    }
    case "json-parse-error": {
      return frameworkSpecificResponseBody(
        bodyParseResult.code,
        "MIME type is valid, but received malformed content."
      );
    }
  }
}
