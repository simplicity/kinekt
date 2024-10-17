export function buildQueryString(query: unknown): string {
  const queryString = query
    ? Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    : "";

  return queryString === "" ? "" : `?${queryString}`;
}
