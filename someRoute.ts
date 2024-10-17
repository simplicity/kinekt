import { z } from "npm:zod";
import { get } from "./get.ts";
import { registerRoute } from "./registerRoute.ts";

type ResponseBody = { b: string };

const someRoute = get(
  "/some/:bla/path?abc",
  z.object({ bla: z.string() }),
  // TODO how to handle z.number()? the param will always come as a string, and zod will fail -> we have to auto-transform it
  z.object({ abc: z.string() }),
  z.custom<ResponseBody>()
);

export const someRouteRegistration = registerRoute(
  someRoute,
  (params, query, body) => {
    console.log("some route!");

    return Promise.resolve({ b: "slkdjf" });
  }
);

// const client = createClient(routeDefinition);

// client({ bla: "1" }, { abc: 1 }).then((result) => console.log(result.b));
