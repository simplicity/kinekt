import type { z } from "zod";
import { html } from "../../../helpers/html";
import { type MimeType } from "../../../helpers/MimeType";

function addMimeType(mimeTypes: Array<MimeType>, mimeType: MimeType) {
  return mimeTypes.includes(mimeType) ? mimeTypes : [...mimeTypes, mimeType];
}

export function collectMimeTypes(response: {
  [key: number]: z.ZodType;
}): Array<MimeType> {
  return Object.values(response).reduce((acc, item) => {
    if (item === html()) {
      return addMimeType(acc, "text/html");
    }

    return addMimeType(acc, "application/json");
  }, new Array<MimeType>());
}
