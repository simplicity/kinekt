<div align="center">
  <h1>Kinekt</h1>
  <h3>Type Safe Rest APIs Made Easy.</h3>

  <img src="https://github.com/simplicity/kinekt/actions/workflows/test.yml/badge.svg?branch=main" alt="Test Results">
  <br />

</div>

<hr>

Define an endpoint as follows:

```TypeScript
export const getUser = app.createEndpoint(
  "GET /users/:id",

  {
    params: z.object({ id: z.string() }),
    response: { 200: z.custom<User>() },
  },

  async ({ params, context }) => {
    const user = await db.users.findOne(params.id);

    return {
      statusCode: 200,
      body: user,
    };
  }
);
```

Serve it, e.g. in node:

```TypeScript
serve([getUser, ...otherEndpoints]);
```

Use the auto-generated client:

```TypeScript
const user = await getUser({ params: { id: "some-id" } });
```

<hr>

# What is Kinekt?

- it is a stand-alone web framework with a custom middleware engine, which means you don't have to integrate it with another framework like expressjs
- it is unopinionated, giving you freedom in how you organize your code
- it is 100% typesafe, including the middleware engine
- it runs on Node, Deno and Bun
