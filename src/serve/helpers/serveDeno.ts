import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import type { HasPipeline, Logger, Method } from "../../types";
import { CreateResponse, postProcess } from "./postProcess";

// TODO fix
declare const Deno: any;

const createResponse: CreateResponse<Response, void> = (
  body,
  statusCode,
  headers
) => new Response(body as BodyInit, { status: statusCode, headers });

export function serveDeno(endpoints: Array<HasPipeline>, logger: Logger) {
  const handleRequest = createRequestHandler(endpoints);

  Deno.serve(
    async (
      // TODO  fix
      request: Request
    ) => {
      const url = new URL(request.url);
      const method = request.method as Method;

      const result = await handleRequest({
        method: method,
        fullUrl: request.url,
        path: url.pathname,
        query: url.search,
        getHeader: (name) => request.headers.get(name),
        readText: () => request.text(),
        readFormData: () => request.formData(),
      });

      return postProcess(result, createResponse, undefined, logger);
    }
  );
}
