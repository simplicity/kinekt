import { BasePipelineContext } from "../../createPipeline/types";

type AuthenticateCustomMiddlewareResponse = {
  authenticateCustomMiddlewareResponse: {
    statusCode: 401;
    body: { error: "Unauthorized" };
  };
};

export type AuthenticateContextExtension = {
  user: string;
} & AuthenticateCustomMiddlewareResponse;

export type AuthenticateContext = BasePipelineContext &
  AuthenticateContextExtension;
