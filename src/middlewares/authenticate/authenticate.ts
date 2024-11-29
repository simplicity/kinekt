import {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { reply } from "./helpers/reply";
import {
  AuthenticateCallback,
  AuthenticateContextExtension,
} from "./helpers/types";

export const authenticate = <
  Session,
  In extends BasePipelineContext,
  Out extends In & AuthenticateContextExtension<Session>
>(
  cb: AuthenticateCallback<In, Session>
): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    reply<Session>(context, await cb(context)) as Out;

  middleware.alwaysRun = true;

  return middleware;
};
