import type { MimeType } from "../../../helpers/MimeType";

export type CheckAcceptHeaderMetadata = {
  type: "reply-with-metadata";
  mimeTypes: Array<MimeType>;
};
