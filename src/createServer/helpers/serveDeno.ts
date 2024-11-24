import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import type { HasPipeline, Method } from "../../helpers/types";
import { CreateResponse, postProcess } from "./postProcess";
import { CreateServerParams } from "./types";

// TODO fix
declare const Deno: any;

const createResponse: CreateResponse<Response, void> = (
  body,
  statusCode,
  headers
) => new Response(body as BodyInit, { status: statusCode, headers });

export function serveDeno(
  endpoints: Array<HasPipeline>,
  params: CreateServerParams
) {
  const handleRequest = createRequestHandler(endpoints);

  Deno.serve(
    {
      port: params.port,
      hostname: params.hostname,
    },
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

      return postProcess(result, createResponse, undefined, params.logger);
    }
  );
}
