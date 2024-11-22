import { vi } from "vitest";
import { z } from "zod";
import { BasePipelineContext } from "../../createPipeline/helpers/types";
import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import { Endpoint } from "../../createValidatedEndpointFactory/helpers/types";
import {
  CreateResponse,
  postProcess,
} from "../../createServer/helpers/postProcess";
import { consoleLogger } from "../consoleLogger";
import {
  EndpointDeclarationBase,
  ExtractPathParams,
  Method,
  StatusCode,
} from "../types";

const createResponse: CreateResponse<Response, void> = (
  body,
  statusCode,
  headers
) => new Response(body as BodyInit, { status: statusCode, headers });

export function mockEndpoint<
  PipelineIn extends BasePipelineContext,
  PipelineOut extends PipelineIn,
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends z.ZodType | unknown,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode
>(
  endpoint: Endpoint<
    PipelineIn,
    PipelineOut,
    EndpointDeclaration,
    PathParams,
    ReqP,
    ReqQ,
    ReqB,
    ResB,
    ResC
  >
): Endpoint<
  PipelineIn,
  PipelineOut,
  EndpointDeclaration,
  PathParams,
  ReqP,
  ReqQ,
  ReqB,
  ResB,
  ResC
> {
  global.fetch = vi.fn(
    async (
      fullUrl: string | URL | globalThis.Request,
      options?: RequestInit
    ) => {
      const body = options?.body as unknown;

      const headers = {
        ...options?.headers,
        ...(body instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {}),
      } as Record<string, string>;

      const handleRequest = createRequestHandler([endpoint]);

      const url = new URL(fullUrl as string);
      const method = options?.method as Method;

      const result = await handleRequest({
        method,
        fullUrl: fullUrl as string,
        path: url.pathname,
        query: url.search,
        getHeader: (name) => headers[name],
        readText: async () => body as string,
        readFormData: async () => body as FormData,
      });

      return postProcess(result, createResponse, undefined, consoleLogger);
    }
  );

  return endpoint;
}
