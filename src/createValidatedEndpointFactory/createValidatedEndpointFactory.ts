import type { z } from "zod";
import { ClientOptions, createClient } from "../createClient/createClient";
import { createPipeline } from "../createPipeline/createPipeline";
import type { BasePipelineContext, Pipeline } from "../createPipeline/types";
import { isCheckAcceptHeaderMetadata } from "../middlewares/checkAcceptHeader/helpers/metadata";
import { DeserializeContextExtension } from "../middlewares/deserialize/types";
import type { RouteHandlerCallback } from "../middlewares/validatedEndpoint/types";
import { validatedEndpoint } from "../middlewares/validatedEndpoint/validatedEndpoint";
import { WithValidationContextExtension } from "../middlewares/withValidation";
import type {
  EndpointDeclarationBase,
  ExtractPathParams,
  ExtractQueryParams,
  RouteDefinition,
  RouteDefinitionWithoutEndpointDeclaration,
  StatusCode,
} from "../types";
import type { Endpoint } from "./types";

export function createValidatedEndpointFactory<
  PrePipelineIn extends BasePipelineContext,
  PrePipelineOut extends PrePipelineIn &
    DeserializeContextExtension &
    WithValidationContextExtension,
  PostPipelineOut extends PrePipelineOut
>(
  pipelines: [
    Pipeline<PrePipelineIn, PrePipelineOut>,
    Pipeline<PrePipelineOut, PostPipelineOut>
  ]
) {
  const globalOptions: ClientOptions = {
    baseUrl: null,
  };

  return {
    createEndpoint: <
      EndpointDeclaration extends EndpointDeclarationBase,
      PathParams extends ExtractPathParams<EndpointDeclaration>,
      QueryParams extends ExtractQueryParams<EndpointDeclaration>,
      ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
      ReqQ extends QueryParams extends void
        ? z.ZodVoid
        : z.ZodType<QueryParams>,
      ReqB extends z.ZodType,
      ResB extends { [key: number]: z.ZodType },
      ResC extends keyof ResB & StatusCode
    >(
      endpointDeclaration: EndpointDeclaration,
      partialRouteDefinition: RouteDefinitionWithoutEndpointDeclaration<
        EndpointDeclaration,
        PathParams,
        QueryParams,
        ReqP,
        ReqQ,
        ReqB,
        ResB
      >,
      callback: RouteHandlerCallback<
        EndpointDeclaration,
        PathParams,
        QueryParams,
        ReqP,
        ReqQ,
        ReqB,
        ResB,
        ResC,
        PrePipelineOut
      >
    ): Endpoint<
      PrePipelineIn,
      PostPipelineOut,
      EndpointDeclaration,
      PathParams,
      QueryParams,
      ReqP,
      ReqQ,
      ReqB,
      ResB,
      ResC
    > => {
      const routeDefinition = {
        ...(partialRouteDefinition as RouteDefinition<
          EndpointDeclaration,
          PathParams,
          QueryParams,
          ReqP,
          ReqQ,
          ReqB,
          ResB
        >),
        endpointDeclaration,
      };

      const [prePipeline, postPipeline] = pipelines;

      const pipeline = createPipeline(
        prePipeline,
        validatedEndpoint(routeDefinition, callback),
        postPipeline
      );

      const metadata = pipeline.collectMetadata();

      const acceptHeader =
        metadata.find(isCheckAcceptHeaderMetadata)?.mimeTypes.at(0) ?? "*/*";

      const endpoint = createClient(routeDefinition, {
        acceptHeader,
        globalOptions,
      }) as Endpoint<
        PrePipelineIn,
        PostPipelineOut,
        EndpointDeclaration,
        PathParams,
        QueryParams,
        ReqP,
        ReqQ,
        ReqB,
        ResB,
        ResC
      >;

      endpoint.pipeline = pipeline;

      return endpoint;
    },
    setGlobalClientOptions: (options: Partial<ClientOptions>) => {
      Object.assign(globalOptions, options);
    },
  };
}
