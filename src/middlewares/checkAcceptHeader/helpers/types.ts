import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import type { MimeType } from "../../../helpers/MimeType";

export type CheckAcceptHeaderContextExtension = {
  supportedMimeType?: MimeType;
};

export type CheckAcceptHeaderContext = BasePipelineContext &
  CheckAcceptHeaderContextExtension;

export type CheckAcceptHeaderMetadata = {
  type: "reply-with-metadata";
  mimeTypes: Array<MimeType>;
};
