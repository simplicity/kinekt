import { vi } from "vitest";
import { z } from "zod";
import { createNotFoundEndpoint } from "../../createNotFoundEndpoint/createNotFoundEndpoint";
import { BasePipelineContext } from "../../createPipeline/helpers/types";
import { createRequestHandler } from "../../createRequestHandler/createRequestHandler";
import { Endpoint } from "../../createSchematizedEndpointFactory/helpers/types";
import {
  CreateResponse,
  postProcess,
} from "../../createServer/helpers/postProcess";
import { noopLogger } from "../noopLogger";
import {
  EndpointDeclarationBase,
  ExtractPathParams,
  Method,
  StatusCode,
} from "../types";

const notFoundEndpoint = createNotFoundEndpoint();

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
        authorization: "c29tZUBlbWFpbC5jb20=",
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
        getHeader: (name) => headers[name] ?? null,
        readText: async () => body as string,
        readFormData: async () => body as FormData,
      });

      return postProcess(result, createResponse, undefined, noopLogger);
    }
  );

  return endpoint;
}
