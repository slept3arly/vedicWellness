export function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}
