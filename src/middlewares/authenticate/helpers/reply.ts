import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { frameworkSpecificResponseBody } from "../../../helpers/frameworkSpecificResponseBody";
import { AuthenticateCallbackResult, AuthenticateContext } from "./types";

export function reply<Session>(
  context: BasePipelineContext,
  result: AuthenticateCallbackResult<Session>
): AuthenticateContext<Session> {
  if (context.response.type === "set") {
    return {
      ...context,
      session: null,
    } as AuthenticateContext<Session>;
  }

  switch (result.type) {
    case "set": {
      return {
        ...context,
        session: result.session,
      } as AuthenticateContext<Session>;
    }
    case "unset": {
      return {
        ...context,
        session: null, // TODO not great
        response: {
          type: "set",
          body: frameworkSpecificResponseBody(
            "authentication-failed",
            "Authentication failed"
          ),
          statusCode: 401,
          headers: {
            ...(context.response.type === "partially-set"
              ? context.response.headers
              : {}),
          },
        },
      } as AuthenticateContext<Session>;
    }
  }
}
