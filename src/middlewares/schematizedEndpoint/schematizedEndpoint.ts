import type { z } from "zod";
import {
  type BasePipelineContext,
  type Middleware,
} from "../../createPipeline/helpers/types";
import { extractMethod } from "../../helpers/extractMethod";
import { removeMethod } from "../../helpers/removeMethod";
import { removeQuery } from "../../helpers/removeQuery";
import { routeMatchMetadata } from "../../helpers/routeMatch";
import type {
  EndpointDeclarationBase,
  ExtractPathParams,
  RouteDefinition,
  StatusCode,
} from "../../helpers/types";
import { checkAcceptHeaderMetadata } from "../checkAcceptHeader/helpers/metadata";
import type { DeserializeContextExtension } from "../deserialize/helpers/types";
import { collectMimeTypes } from "./helpers/collectMimeTypes";
import { getValidationResult } from "./helpers/getValidationResult";
import { reply } from "./helpers/reply";
import type {
  RouteHandlerCallback,
  ValidatedEndpointContextExtension,
} from "./helpers/types";

// TODO rename
export const validatedEndpoint = <
  In extends BasePipelineContext & DeserializeContextExtension,
  Out extends In & ValidatedEndpointContextExtension,
  EndpointDeclaration extends EndpointDeclarationBase,
  PathParams extends ExtractPathParams<EndpointDeclaration>,
  ReqP extends PathParams extends void ? z.ZodVoid : z.ZodType<PathParams>,
  ReqQ extends z.ZodType | unknown,
  ReqB extends z.ZodType,
  ResB extends { [key: number]: z.ZodType },
  ResC extends keyof ResB & StatusCode
>(
  routeDefinition: RouteDefinition<
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
    In
  >
): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) => {
    if (context.response.type === "set") {
      return reply(context, null, []) as Out;
    }

    if (context.request.deserializedBody.type === "unset") {
      return reply(context, null, []) as Out;
    }

    const validationResult = await getValidationResult(
      context.request.deserializedBody.body,
      context.request.method,
      routeDefinition,
      context.request.params,
      context.request.query
    );

    if (validationResult.type === "error") {
      return reply(
        context,
        null,
        validationResult.metadata.validationErrors
      ) as Out;
    }

    const response = await callback({
      params: validationResult.value.parsedParams,
      query: validationResult.value.parsedQuery,
      body: validationResult.value.parsedBody,
      context,
    });

    return reply(
      context,
      {
        type: "set",
        statusCode: response.statusCode,
        body: response.body,
        headers: {},
      },
      []
    ) as Out;
  };

  const method = extractMethod(routeDefinition.endpointDeclaration);
  const path = removeQuery(removeMethod(routeDefinition.endpointDeclaration));

  middleware.collectMetadata = () => [
    routeMatchMetadata([{ method, path }]),
    checkAcceptHeaderMetadata(collectMimeTypes(routeDefinition.response)),
  ];

  return middleware;
};
