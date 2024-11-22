<div align="center">
  <h1>Kinekt</h1>
  <h3>Type Safe Rest APIs Made Easy.</h3>
  <h4>Pronounced like <i>connect</i> but with an i.</h4>

  <img src="https://github.com/simplicity/kinekt/actions/workflows/test.yml/badge.svg?branch=main" alt="Test Results">
  <br />
</div>

<hr>

Define an endpoint as follows:

```TypeScript
export const getUser = app.createEndpoint(
  "GET /users/:id",

  {
    params: z.object({
      id: z.string()
    }),

    response: {
      200: z.custom<User>()
    },
  },

  async ({ params }) => {
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
- it is simple and modular, giving you freedom in how you organize your code
- it is 100% typesafe all the way down to the middleware engine

# Middlewares and Pipelines

Like many other web frameworks, Kinekt uses middlewares which are combined into pipelines to handle requests. An incoming request will be transformed into a context object and passed through a given pipeline. In Kinekt, every endpoint is a pipeline. This gives you great flexibility when creating endpoints of varying kinds.

```TypeScript
const pipeline = createPipeline(
  cors(),
  authenticate(),
  checkAcceptHeader(),
  deserialize(),
  basicEndpoint(params),
  serialize(),
  finalize()
)
```

# Type Safety

Kinekt aims to be 100% Type Safe.

For example, adding an authenticate middleware to your pipeline will make a `user` property available on the pipeline context which you can then consume in a request handler:

```TypeScript
const pipeline = createPipeline(
  ...,
  authenticate(),
  ...
)
```

You now have access to a `context.user` property:

```TypeScript
export const getUser = app.createEndpoint(
  // ...

  async ({ context }) => {
    const currentUser = context.user; // <-- the compiler gives an error if the authenticate middleware is not present in the pipeline

    // ...
  }
);
```

When creating validated endpoints, you can accurately declare each aspect of your contract and the compiler will take care of warning you about any violations:

```TypeScript
export const createComment = testPipeline.createEndpoint(
  "POST /posts/:postId/comments",
  //             ^---- by using a param segment, you are forced to use a `params` schema containing `postId`

  // ^---- by using POST method here, you are forced to declare a body schema

  {
    params: z.object({ postId: z.string() }), //              <- params schema
    query: z.object({ anonymous: zodBooleanFromString() }),
    body: z.object({ text: z.string() }), //                  <- body schema

    response: {
      // You must explicitly declare which bodies are returned for which status codes
      200: z.custom<Comment>(),
      422: z.object({ error: z.string() }),
    },
  },

  async ({ params, query, body, context }) => {
    // You must return bodies and status codes as declared in the response schemas

    if (query.anonymous === true) {
      return {
        statusCode: 422,
        body: {
          error: "Anonymous creation is not yet supported",
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        id: "some-id",
        text: body.text,
        postId: params.postId,
        createdBy: context.user,
      },
    };
  }
);
```
