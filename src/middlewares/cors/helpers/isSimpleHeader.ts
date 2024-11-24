export function isSimpleHeader(header: string): boolean {
  return ["accept", "accept-language", "content-language"].includes(
    header.toLowerCase()
  );
}
