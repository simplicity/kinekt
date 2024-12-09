import type {
  BasePipelineContext,
  BasePipelineContextResponseSet,
} from "../../../createPipeline/helpers/types";
import { MimeType } from "../../../helpers/MimeType";
import { CheckAcceptHeaderContext } from "./types";

export function reply(
  context: BasePipelineContext,
  response: BasePipelineContextResponseSet | null,
  supportedMimeType: MimeType | null
): CheckAcceptHeaderContext {
  return {
    ...context,
    ...(response
      ? {
          response: {
            ...response,
            headers: {
              ...(context.response.type === "partially-set"
                ? context.response.headers
                : {}),
              ...response.headers,
            },
          },
        }
      : {}),
    supportedMimeType,
  };
}
