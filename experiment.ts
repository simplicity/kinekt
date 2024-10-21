import z from "npm:zod";

// TODO remove later

type StatusCode = 200 | 400;

function experiment<
  Schema extends { [key: number]: z.ZodType },
  K extends keyof Schema & StatusCode
>(schemas: Schema, cb: () => { code: K; body: z.infer<Schema[K]> }) {}

// Example with multiple status codes
experiment(
  {
    200: z.object({ test: z.string() }),
    400: z.object({ error: z.string() }),
  },
  () => {
    if (Math.random() === 1) {
      return { code: 200, body: { test: "Bad Request" } };
    } else {
      return { code: 400, body: { error: "Bad Request" } };
    }
  }
);

experiment(
  {
    200: z.object({ test: z.string() }),
    400: z.object({ error: z.string() }),
  },
  () => {
    return { code: 200, body: { test: "Success" } };
  }
);
