import { normalizeQuery } from "./normalizeQuery";

const NUMERIC_TOKEN_PATTERN = /^\d+$/;

export function isNumericToken(token: string) {
  return NUMERIC_TOKEN_PATTERN.test(token);
}

export function tokenize(query: string) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return [];
  }

  return normalizedQuery
    .split(/\s+/)
    .filter((token) => token.length >= 2 || isNumericToken(token));
}
