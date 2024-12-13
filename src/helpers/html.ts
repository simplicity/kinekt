import z from "zod";

const LITERAL = "<kinekt-html-response>";

const schema = z.object({
  type: z.literal(LITERAL),
  html: z.string(),
});

type HtmlSchema = z.infer<typeof schema>;

export const html = {
  schema: () => schema,
  reply: (html: string) => ({ type: LITERAL, html } satisfies HtmlSchema),
};

export function isHtml(body: unknown): body is HtmlSchema {
  return (body as any)?.type === LITERAL;
}
