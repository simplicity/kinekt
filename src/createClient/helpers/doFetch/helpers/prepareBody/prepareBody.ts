import type { SupportedRequestMimeTypes } from "../../../../types";
import { serializeToJson } from "./helpers/serializeToJson";
import { serializeToMultiPartFormData } from "./helpers/serializeToMultiPartFormData";

export async function prepareBody(
  mimeType: SupportedRequestMimeTypes,
  body: unknown
) {
  switch (mimeType) {
    case "application/json": {
      return serializeToJson(body);
    }
    case "multipart/form-data": {
      return serializeToMultiPartFormData(body);
    }
  }
}
