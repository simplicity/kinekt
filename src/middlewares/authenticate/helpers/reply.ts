import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import { precheckResponseBody } from "../../../helpers/precheckResponseBody";
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
          // TODO this has to adapt to json output if the endpoint returns json. is that the case?
          body: precheckResponseBody(
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
