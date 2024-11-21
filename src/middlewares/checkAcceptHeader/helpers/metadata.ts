import type { MimeType } from "../../../helpers/MimeType";
import { CheckAcceptHeaderMetadata } from "./types";

export function isCheckAcceptHeaderMetadata(
  metadata: unknown
): metadata is CheckAcceptHeaderMetadata {
  return (
    (metadata as CheckAcceptHeaderMetadata | undefined)?.type ===
    "reply-with-metadata"
  );
}

export function checkAcceptHeaderMetadata(
  mimeTypes: Array<MimeType>
): CheckAcceptHeaderMetadata {
  return {
    type: "reply-with-metadata",
    mimeTypes,
  };
}
