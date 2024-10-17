import type { z } from "zod";
import type { MimeType } from "../helpers/MimeType";
import type { ErrorResult, OkResult } from "../helpers/result";
import type {
  EndpointDeclarationBase,
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
  StatusCode,
} from "../types";

export type Client<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode,
  CustomMiddlewareResponses
> = (
  props: (ReqP extends z.ZodVoid
    ? {
        params?: void;
      }
    : {
        params: z.infer<ReqP>;
      }) &
    (ReqQ extends z.ZodVoid
      ? {
          query?: void;
        }
      : {
          query: z.infer<ReqQ>;
        }) &
    (ExtractMethod<EndpointDeclaration> extends "GET"
      ? {
          body?: void;
        }
      : {
          body: z.infer<ReqB>;
        })
) => Promise<
  | {
      [StatusCode in ResC]: OkResult<{
        statusCode: StatusCode;
        body: z.infer<ResB[StatusCode]>;
      }>;
    }[ResC]
  | OkResult<CustomMiddlewareResponses>
  | ErrorResult<"body-parse-error", { text?: string; statusCode: StatusCode }>
  | ErrorResult<"network-error", { cause: string }>
  | ErrorResult<"internal-server-error", { cause: unknown }>
  | ErrorResult<"invalid-mime-type-requested", { cause: unknown }>
  | ErrorResult<"invalid-mime-type-provided", { cause: unknown }>
>;

export type SupportedRequestMimeTypes = Extract<
  MimeType,
  "application/json" | "multipart/form-data"
>;
