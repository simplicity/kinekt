import { toResult } from "../../../helpers/result";
import type { Method } from "../../../helpers/types";
import { determineMimeType } from "../determineMimeType";
import { prepareBody } from "./helpers/prepareBody/prepareBody";

export async function doFetch(
  url: string,
  method: Method,
  body: unknown,
  acceptHeader: string,
  authorizationHeader: string | undefined
) {
  const mimeType =
    method !== "GET" && body !== undefined && body !== null
      ? determineMimeType(body)
      : null;

  return toResult(
    fetch(url, {
      headers: {
        ...(mimeType === "multipart/form-data" || mimeType === null
          ? {}
          : { "content-type": mimeType }),
        accept: acceptHeader,
        ...(authorizationHeader ? { authorization: authorizationHeader } : {}),
      },
      method,
      ...(mimeType === null
        ? {}
        : {
            body: await prepareBody(mimeType, body),
          }),
    })
  );
}
