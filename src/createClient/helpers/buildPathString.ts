import { removeQuery } from "../../helpers/removeQuery";

export function buildPathString(params: any, path: string): string {
  return params
    ? Object.entries(params).reduce<string>(
        (acc, [key, value]) => acc.replace(`:${key}`, value as string),
        removeQuery(path)
      )
    : path;
}
