import { BasePipelineContext } from "../../../createPipeline/helpers/types";
import {
  AuthenticateCallbackResult,
  AuthenticateContext,
  UnauthorizedResponseBody,
} from "./types";

export function reply<Session>(
  context: BasePipelineContext,
  result: AuthenticateCallbackResult<Session>
): AuthenticateContext<Session> {
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
          body: { error: "Unauthorized" } satisfies UnauthorizedResponseBody,
          statusCode: 401,
          headers: {
            ...(context.response.type !== "unset"
              ? context.response.headers
              : {}),
          },
        },
      } as AuthenticateContext<Session>;
    }
  }
}
