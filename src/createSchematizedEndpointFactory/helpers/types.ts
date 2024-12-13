import { z } from "zod";
import type { Client } from "../../createClient/helpers/types";
import type {
  BasePipelineContext,
  Pipeline,
} from "../../createPipeline/helpers/types";
import type {
  EndpointDeclarationBase,
  ExtractPathParams,
  StatusCode,
} from "../../helpers/types";

type ExtractCustomMiddlewareResponses<T> = {
  [K in keyof T]: K extends `${string}CustomMiddlewareResponse` ? T[K] : never;
}[keyof T];

export type Endpoint<
  PipelineIn extends BasePipelineContext,
  PipelineOut extends PipelineIn,
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends z.ZodType | unknown,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode
> = Client<
  EndpointDeclaration,
  PathParams,
  ReqP,
  ReqQ,
  ReqB,
  ResB,
  ResC,
  ExtractCustomMiddlewareResponses<PipelineOut>
> & {
  pipeline: Pipeline<PipelineIn, PipelineOut>;
};
