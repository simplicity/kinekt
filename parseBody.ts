export async function parseBody(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    // TODO avoid throw
    throw new Error("Unable to parse response", {
      cause: `Tried to parse json, received:\n\n${text}`,
    });
  }
}
