import type {
  BasePipelineContext,
  BasePipelineContextError,
  BasePipelineContextResponseSet,
  PipelineMetadata,
} from "../../createPipeline/helpers/types";
import type { MimeType } from "../MimeType";
import type { Method } from "../types";

export type CreateTestContextParams = {
  method?: Method;
  fullUrl?: string;
  path?: string;
  params?: unknown;
  query?: string;
  requestHeaders?: Record<string, string>;
  text?: string;
  contentType?: MimeType;
  accept?: MimeType;
  formData?: FormData;
  response?: BasePipelineContextResponseSet;
  error?: BasePipelineContextError;
  metadata?: PipelineMetadata;
};

export function createTestContext(
  params?: CreateTestContextParams
): BasePipelineContext {
  const headers: Record<string, string> = {
    ...params?.requestHeaders,
    ...(params?.contentType ? { "content-type": params.contentType } : {}),
    ...(params?.accept ? { accept: params.accept } : {}),
  };

  return {
    request: {
      method: params?.method ?? "GET",
      fullUrl: params?.fullUrl ?? "/",
      path: params?.path ?? "/",
      params: params?.params ?? {},
      query: params?.query ?? "",
      getHeader: (name) => headers[name] ?? null,
      readText: async () => params?.text ?? "",
      readFormData: async () => params?.formData ?? new FormData(),
    },
    response: params?.response ?? { type: "unset" },
    error: params?.error ?? { type: "no-error" },
    startTime: 0,
    metadata: params?.metadata ?? [],
  };
}
