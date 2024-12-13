import { Logger } from "../../helpers/types";
import { AuthenticateCallback } from "../../middlewares/authenticate/helpers/types";
import { CorsParams } from "../../middlewares/cors/helpers/types";

export type CreateDefaultSetupParams<Session> = {
  getSession: AuthenticateCallback<Session>;
  cors?: CorsParams;
  checkAcceptHeader?: boolean;
  logger?: Logger;
};
