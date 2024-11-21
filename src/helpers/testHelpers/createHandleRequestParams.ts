import type { HandleRequestParamsWithoutRouteTree } from "../../createRequestHandler/createRequestHandler";
import type { MimeType } from "../MimeType";
import type { Method } from "../types";

export function createHandleRequestParams(request?: {
  method?: Method;
  fullUrl?: string;
  path?: string;
  query?: string;
  headers?: Record<string, string>;
  text?: string;
  contentType?: MimeType;
  formData?: FormData;
}): HandleRequestParamsWithoutRouteTree {
  const headers: Record<string, string> = {
    ...request?.headers,
    ...(request?.contentType ? { "Content-Type": request?.contentType } : {}),
  };

  return {
    method: request?.method ?? "GET",
    fullUrl: request?.fullUrl ?? "/",
    path: request?.path ?? "/",
    query: request?.query ?? "",
    getHeader: (name) => headers[name],
    readText: async () => request?.text ?? "",
    readFormData: async () => request?.formData ?? new FormData(),
  };
}
