<div align="center">
  <h1>Kinekt</h1>
  <h3>Build REST APIs With High Precision.</h3>
  <h4>Pronounced like 'connect' but with an i.</h4>

  <a href="https://github.com/simplicity/kinekt/actions/workflows/test.yml">
    <img src="https://github.com/simplicity/kinekt/actions/workflows/test.yml/badge.svg?branch=main" alt="Test Results">
  </a>

  <a href='https://coveralls.io/github/simplicity/kinekt?branch=main'>
    <img src='https://coveralls.io/repos/github/simplicity/kinekt/badge.svg?branch=main' alt='Coverage Status' />
  </a>

  <a href='https://bundlephobia.com/result?p=hono'>
    <img src='https://img.shields.io/bundlephobia/min/kinekt' alt='Minified Size' />
  </a>

  <a href='https://bundlephobia.com/result?p=hono'>
    <img src='https://img.shields.io/bundlephobia/minzip/kinekt' alt='Minzipped Size' />
  </a>
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

  async ({ params }) => {
    const user = await db.users.findOne(params.id);

    return {
      statusCode: 200,
      body: user,
    };
  }
);
```

Serve it:

```TypeScript
const serve = createServer({port: 3000, hostname: "localhost"});
serve(getUser, ...otherEndpoints);
```

Use it through the auto-generated client:

```TypeScript
const user = await getUser({ params: { id: "some-id" } }).ok(200);
```

<hr>

# Kinekt - what is it and how does it work?

- it is a stand-alone web framework with a custom middleware engine, which means you don't have to integrate it with another framework like expressjs
- it is simple and modular, giving you freedom in how you organize your code
- it is 100% typesafe all the way down to the middleware engine

## Middlewares and Pipelines

Kinekt uses middlewares which are combined into pipelines to handle requests. An incoming request will be transformed into a context object and passed through a given pipeline.

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

const result = await pipeline(context)
```

## Efficient routing

Kinekt uses a route tree, compiled at startup, to efficiently dispatch incoming requests to the correct pipelines.

## Type Safety

Kinekt aims to be 100% Type Safe.

For example, adding an `authenticate()` middleware to your pipeline will make a `user` property available on the pipeline context which you can then consume in a request handler:

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
    const currentUser = context.user; // <-- the compiler gives an error if the
                                      //     authenticate middleware is not
                                      //     present in the pipeline.

    // ...
  }
);
```

When creating validated endpoints, you can accurately declare each aspect of your contract and the compiler will take care of warning you about any violations:

```TypeScript
export const createUser = testPipeline.createEndpoint(
  "POST /organization/:organizationId/users",
  //                        ^---- by using a param segment, you are forced to
  //                              use a `params` schema containing
  //                              `organizationId` (see below).

  // ^---- by using POST method here, you are forced to declare a body schema
  //       (see below).

  {
    params: z.object({ organizationId: z.string() }), //    <- params schema
    query: z.object({ private: zodBooleanFromString() }),
    body: z.object({ email: z.string() }), //               <- body schema

    response: {
      // You must explicitly declare which bodies are returned for which status
      // codes.
      200: z.custom<User>(),
      409: z.custom<{ message: string }>(),
    },
  },

  async ({ params, query, body, context }) => {
    // You must return bodies and status codes as declared in the response
    // schemas.
    if (body.email === "existing@email.com") {
      return {
        statusCode: 409,
        body: { message: "User with this email already exists" },
      };
    }

    return {
      statusCode: 200,
      body: {
        id: "some-id",
        email: body.email,
        organizationId: params.organizationId,
        private: query.private,
      },
    };
  }
);
```
