import { BasePipelineContext } from "../../../createPipeline/types";
import { AuthenticateContext } from "../types";

export function reply(context: BasePipelineContext): AuthenticateContext {
  return {
    ...context,
    user: "stuffs",
  } as AuthenticateContext;
}
