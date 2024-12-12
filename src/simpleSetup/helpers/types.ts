import { BasePipelineContext } from "../../createPipeline/helpers/types";
import { AuthenticateCallback } from "../../middlewares/authenticate/helpers/types";
import { CorsParams } from "../../middlewares/cors/helpers/types";
import { DeserializeContextExtension } from "../../middlewares/deserialize/helpers/types";

export type CreateDefaultSetupParams<Session> = {
  getSession: AuthenticateCallback<
    BasePipelineContext & DeserializeContextExtension,
    Session
  >;
  cors?: CorsParams;
  checkAcceptHeader?: boolean;
};
