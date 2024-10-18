import z from "npm:zod";
import { createEndpoint } from "../../src/createEndpoint/createEndpoint.ts";
import { get } from "../../src/routeDefinition/get.ts";

type User = {
  name: string;
  email: string;
};

export const getUser = createEndpoint(
  get(
    "/users/:id?includePosts",
    z.object({ id: z.string() }),
    z.object({ includePosts: z.boolean() }),
    z.custom<User>()
  ),
  (params, query) => {
    console.log("other route!", params.id, query.includePosts);
    return Promise.resolve({ name: "", email: "" });
  }
);
