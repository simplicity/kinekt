import * as http from "http";
import { ServerResponse } from "http";
import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import { HasPipeline, Logger, Method } from "../../helpers/types";
import { CreateResponse, postProcess } from "./postProcess";

const createResponse: CreateResponse<void, ServerResponse> = (
  body,
  statusCode,
  headers,
  response
) => {
  response.statusCode = statusCode;
  if (headers !== undefined) {
    response.setHeaders(
      // TODO not great
      new Map(Object.entries(headers))
    );
  }
  response.end(body);
};

export async function serveNode(endpoints: Array<HasPipeline>, logger: Logger) {
  const handleRequest = createRequestHandler(endpoints);

  const server = http.createServer(async (request, response) => {
    const [path, query] = (request.url ?? "").split("?") as [
      string,
      string | undefined
    ];

    // TODO avoid casts?
    const result = await handleRequest({
      method: request.method as Method,
      fullUrl: request.url as string,
      path,
      query: query ?? "",
      getHeader: (name) => {
        const result = request.headers[name];
        if (result === undefined) {
          return null;
        } else if (result instanceof Array) {
          return result.at(0) ?? null;
        } else {
          return result;
        }
      },
      readText: () =>
        new Promise<string>((resolve, reject) => {
          let body = "";
          request.on("data", (chunk) => {
            body += chunk;
          });
          request.on("end", () => resolve(body));
          request.on("error", (err) => reject(err));
        }),
      readFormData: () => null as any,
    });

    return postProcess(result, createResponse, response, logger);
  });

  const port = 3000;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}
