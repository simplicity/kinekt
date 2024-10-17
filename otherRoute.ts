import { z } from "npm:zod";
import { get } from "./src/get.ts";
import { createRouteHandler } from "./src/createRouteHandler/createRouteHandler.ts";

type ResponseBody = { result: number };

const otherRoute = get(
  "/cool",
  // TODO this is incorrect
  z.object({ la: z.string() }),
  z.void(),
  z.custom<ResponseBody>()
);

export const otherRouteRegistration = createRouteHandler(
  otherRoute,
  (params, query, body) => {
    console.log("other route!");

    return Promise.resolve({ result: 1234 });
  }
);
