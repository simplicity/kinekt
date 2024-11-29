import { BasePipelineContext } from "../../../createPipeline/helpers/types";

// TODO how to make this configurable?
export type UnauthorizedResponseBody = { error: "Unauthorized" };

type AuthenticateCustomMiddlewareResponse = {
  authenticateCustomMiddlewareResponse: {
    statusCode: 401;
    body: UnauthorizedResponseBody;
  };
};

export type AuthenticateContextExtension<Session> = {
  session: Session;
} & AuthenticateCustomMiddlewareResponse;

export type AuthenticateContext<Session> = BasePipelineContext &
  AuthenticateContextExtension<Session>;

export type AuthenticateCallbackResult<Session> =
  | { type: "set"; session: Session }
  | { type: "unset" };

export type AuthenticateCallback<In extends BasePipelineContext, Session> = (
  context: In
) => Promise<AuthenticateCallbackResult<Session>>;
