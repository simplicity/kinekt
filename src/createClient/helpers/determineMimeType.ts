import { isFileData } from "../../helpers/fileData";
import type { SupportedRequestMimeTypes } from "./types";

export function determineMimeType(body: unknown): SupportedRequestMimeTypes {
  return Object.values(body as any).find(isFileData)
    ? "multipart/form-data"
    : "application/json";
}
