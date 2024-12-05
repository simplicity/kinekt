import { Logger } from "../../../helpers/types";
import { FinalizeContext } from "../../finalize/helpers/types";

export type LoggerParams = {
  logger?: Logger;
  getLogStatement?: (context: FinalizeContext) => Promise<string>;
};
