import type { z } from "zod";
import { ClientParams, createClient } from "../createClient/createClient";
import { createPipeline } from "../createPipeline/createPipeline";
import type {
  BasePipelineContext,
  Pipeline,
} from "../createPipeline/helpers/types";
import type {
  EndpointDeclarationBase,
  ExtractPathParams,
  RouteDefinition,
  RouteDefinitionWithoutEndpointDeclaration,
  StatusCode,
} from "../helpers/types";
import { isCheckAcceptHeaderMetadata } from "../middlewares/checkAcceptHeader/helpers/metadata";
import { DeserializeContextExtension } from "../middlewares/deserialize/helpers/types";
import type { RouteHandlerCallback } from "../middlewares/validatedEndpoint/helpers/types";
import { validatedEndpoint } from "../middlewares/validatedEndpoint/validatedEndpoint";
import { WithValidationContextExtension } from "../middlewares/withValidation";
import type { Endpoint } from "./helpers/types";

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
  const clientParams: ClientParams = {
    baseUrl: null,
  };

  return {
    createEndpoint: <
      EndpointDeclaration extends EndpointDeclarationBase,
      PathParams extends ExtractPathParams<EndpointDeclaration>,
      ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
      ReqQ extends z.ZodType | unknown,
      ReqB extends z.ZodType,
      ResB extends { [key: number]: z.ZodType },
      ResC extends keyof ResB & StatusCode
    >(
      endpointDeclaration: EndpointDeclaration,
      partialRouteDefinition: RouteDefinitionWithoutEndpointDeclaration<
        EndpointDeclaration,
        PathParams,
        ReqP,
        ReqQ,
        ReqB,
        ResB
      >,
      callback: RouteHandlerCallback<
        EndpointDeclaration,
        PathParams,
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
        clientParams,
      }) as Endpoint<
        PrePipelineIn,
        PostPipelineOut,
        EndpointDeclaration,
        PathParams,
        ReqP,
        ReqQ,
        ReqB,
        ResB,
        ResC
      >;

      endpoint.pipeline = pipeline;

      return endpoint;
    },
    setGlobalClientParams: (partialClientParams: Partial<ClientParams>) => {
      Object.assign(clientParams, partialClientParams);
    },
  };
}
