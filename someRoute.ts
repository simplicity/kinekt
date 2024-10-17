import { z } from "npm:zod";
import { get } from "./get.ts";
import { registerRoute } from "./registerRoute.ts";

type ResponseBody = { b: string };

const someRoute = get(
  "/some/:bla/path?abc",
  z.object({ bla: z.string() }),
  z.object({ abc: z.number() }),
  z.custom<ResponseBody>()
);

export const someRouteRegistration = registerRoute(
  someRoute,
  (params, query, body) => {
    console.log("some route!");

    console.log(params);
    console.log(query);
    console.log(body);

    return Promise.resolve({ b: "slkdjf" });
  }
);

// const client = createClient(routeDefinition);

// client({ bla: "1" }, { abc: 1 }).then((result) => console.log(result.b));
