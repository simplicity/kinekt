import type { z } from "zod";
import type { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { Result } from "../../../helpers/result";
import type {
  EndpointDeclarationBase,
  ExtractMethod,
  ExtractPathParams,
  ExtractQueryParams,
  StatusCode,
} from "../../../helpers/types";
import { DeserializeContextExtension } from "../../deserialize/helpers/types";
import { WithValidationContextExtension } from "../../withValidation";

export type RouteHandlerCallback<
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  QueryParams extends ExtractQueryParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends QueryParams extends void ? z.ZodVoid : z.ZodType<QueryParams>,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode,
  PipelineContext extends BasePipelineContext
> = (params: {
  params: z.infer<ReqP>;
  query: z.infer<ReqQ>;
  body: ExtractMethod<EndpointDeclaration> extends "GET" ? void : z.infer<ReqB>;
  context: PipelineContext;
}) => Promise<
  {
    [StatusCode in ResC]: {
      statusCode: StatusCode;
      body: z.infer<ResB[StatusCode]>;
    };
  }[ResC]
>;

export type ValidationError = { message: string };

export type ValidationErrors = Array<ValidationError>;

export type ValidationResult = Result<
  {
    parsedParams: any;
    parsedQuery: any;
    parsedBody: any;
  },
  "validation-error",
  { validationErrors: ValidationErrors }
>;

export type ValidatedEndpointContext = BasePipelineContext &
  DeserializeContextExtension &
  WithValidationContextExtension;
