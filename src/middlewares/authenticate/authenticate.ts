import {
  BasePipelineContext,
  Middleware,
} from "../../createPipeline/helpers/types";
import { reply } from "./helpers/reply";
import { AuthenticateContextExtension } from "./helpers/types";

export const authenticate = <
  In extends BasePipelineContext,
  Out extends In & AuthenticateContextExtension
>(): Middleware<In, Out> => {
  const middleware: Middleware<In, Out> = async (context) =>
    reply(context) as Out;

  middleware.alwaysRun = true;

  return middleware;
};
