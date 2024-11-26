import { vi } from "vitest";
import { z } from "zod";
import { createPipeline } from "../../createPipeline/createPipeline";
import { BasePipelineContext } from "../../createPipeline/helpers/types";
import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import {
  CreateResponse,
  postProcess,
} from "../../createServer/helpers/postProcess";
import { Endpoint } from "../../createValidatedEndpointFactory/helpers/types";
import { notFound } from "../../middlewares/notFound/notFound";
import { consoleLogger } from "../consoleLogger";
import {
  EndpointDeclarationBase,
  ExtractPathParams,
  Method,
  StatusCode,
} from "../types";

const notFoundEndpoint = { pipeline: createPipeline(notFound()) };

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
  >,
  params?: { dontServe?: true; serveNotFound?: true }
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
      requestInit?: RequestInit
    ) => {
      const body = requestInit?.body as unknown;

      const headers = {
        ...requestInit?.headers,
        ...(body instanceof FormData
          ? { "content-type": "multipart/form-data" }
          : {}),
      } as Record<string, string>;

      const handleRequest = createRequestHandler([
        ...(params?.dontServe ? [] : [endpoint]),
        ...(params?.serveNotFound ? [notFoundEndpoint] : []),
      ]);

      const url = new URL(fullUrl as string);
      const method = requestInit?.method as Method;

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
