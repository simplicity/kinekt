import type { BasePipelineContext } from "../../../../createPipeline/helpers/types";
import { mimeTypes, type MimeType } from "../../../../helpers/MimeType";
import {
  errorResult,
  type ErrorResult,
  type Result,
} from "../../../../helpers/result";
import { deserializeJson } from "./helpers/deserializeJson";
import { deserializeMultipartFormData } from "./helpers/deserializeMultipartFormData";
import { deserializeText } from "./helpers/deserializeText";
import { deserializeUrlEncodedFormData } from "./helpers/deserializeUrlEncodedFormData";

export async function parseBodyAccordingToMimeType(
  context: BasePipelineContext
): Promise<
  | Result<unknown, "json-parse-error", { text: string }>
  | ErrorResult<"unsupported-mime-type", { mimeType: string | undefined }>
> {
  // TODO test what happens when no Content-Type header is passed at all
  const mimeType = context.request.getHeader("Content-Type")?.split(";").at(0);

  if (!mimeTypes.includes(mimeType as MimeType)) {
    return errorResult(
      "unsupported-mime-type",
      `Unsupported MIME type '${mimeType}'`,
      {
        mimeType,
      }
    );
  }

  switch (mimeType as MimeType | undefined) {
    case undefined:
    case "*/*":
    case "application/json": {
      return deserializeJson(context);
    }
    case "application/x-www-form-urlencoded": {
      return deserializeUrlEncodedFormData(context);
    }
    case "multipart/form-data": {
      return deserializeMultipartFormData(context);
    }
    case "text/html": {
      return deserializeText(context);
    }
  }
}
