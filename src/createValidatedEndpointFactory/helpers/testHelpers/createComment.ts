import { z } from "zod";
import { testPipeline } from "./testPipeline";

// TODO clean this stuff up a bit (the folder)

type Comment = {
  id: string;
  text: string;
  postId: string;
  createdBy: string;
};

function zodBooleanFromString() {
  return z.enum(["true", "false"]).transform((value) => value === "true");
}

export const createComment = testPipeline.createEndpoint(
  "POST /posts/:postId/comments",

  {
    params: z.object({ postId: z.string() }),
    query: z.object({ anonymous: zodBooleanFromString() }),
    body: z.object({ text: z.string() }),

    response: {
      200: z.custom<Comment>(),
      422: z.object({ error: z.string() }),
    },
  },

  async ({ params, query, body, context }) => {
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
