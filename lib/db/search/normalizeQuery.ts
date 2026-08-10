export const MAX_SEARCH_LENGTH = 100;
export const MAX_SEARCH_TOKENS = 5;

export function normalizeQuery(query: string) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
  const boundedLength = normalized.slice(0, MAX_SEARCH_LENGTH);

  return boundedLength
    .split(" ")
    .slice(0, MAX_SEARCH_TOKENS)
    .join(" ");
}
