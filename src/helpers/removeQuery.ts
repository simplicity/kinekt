export function removeQuery(path: string): string {
  return path.replace(/\?.*$/, "");
}
