import { z } from "npm:zod";
import { createClient } from "./createClient.ts";
import { get } from "./get.ts";
import { registerEndpoint } from "./registerEndpoint.ts";

type ResponseBody = { b: string };

const routeDefinition = get(
  "/some/:bla/path?abc",
  z.object({ bla: z.string() }),
  z.object({ abc: z.number() }),
  z.custom<ResponseBody>()
);

registerEndpoint(routeDefinition, ({ params, query, body }) => {
  console.log(params.bla);
  console.log(query.abc);
  console.log(body);

  return Promise.resolve({ b: "slkdjf" });
});

const client = createClient(routeDefinition);

client({ bla: "1" }, { abc: 1 }).then((result) => console.log(result.b));
