import { normalizeQuery } from "./normalizeQuery";
import { createSearchConfig } from "./searchConfig";
import { isNumericToken, tokenize } from "./tokenize";
import type {
  SearchConfig,
  SearchToken,
  SearchWhereClause,
  SearchWhereInput,
} from "./types";

function buildNestedCondition(
  fieldPath: string,
  value: SearchWhereClause
): SearchWhereClause {
  const segments = fieldPath.split(".").filter(Boolean);

  return segments.reduceRight<SearchWhereClause>((accumulator, segment) => {
    // handle relation arrays via `.some`
    if (segment === "some") {
      return {
        some: accumulator,
      };
    }

    return {
      [segment]: accumulator,
    };
  }, value);
}

function buildContainsCondition(token: SearchToken): SearchWhereClause {
  if (token.isNumeric) {
    return {
      contains: token.value,
    };
  }

  return {
    contains: token.value,
    mode: "insensitive",
  };
}

function buildTextConditions(
  token: SearchToken,
  fields: readonly string[]
): SearchWhereClause[] {
  return fields.map((field) => ({
    [field]: buildContainsCondition(token),
  }));
}

function buildExactConditions(
  token: SearchToken,
  fields: readonly string[]
): SearchWhereClause[] {
  return fields.map((field) => ({
    [field]: {
      equals: token.value,
      mode: "insensitive", // FIX: case-insensitive exact match
    },
  }));
}

function buildEnumConditions(
  token: SearchToken,
  config: SearchConfig
): SearchWhereClause[] {
  return config.enum
    .filter((field) => field.values.includes(token.enumValue))
    .map((field) => ({
      [field.path]: {
        equals: token.enumValue,
      },
    }));
}

function buildRelationConditions(
  token: SearchToken,
  fields: readonly string[]
): SearchWhereClause[] {
  return fields.map((field) =>
    buildNestedCondition(field, buildContainsCondition(token))
  );
}

function buildSearchToken(token: string): SearchToken {
  return {
    value: token,
    isNumeric: isNumericToken(token),
    enumValue: token.toUpperCase(),
  };
}

function buildTokenConditions(
  token: SearchToken,
  config: SearchConfig
): SearchWhereClause[] {
  return [
    ...buildTextConditions(token, config.text),
    ...buildExactConditions(token, config.exact),
    ...buildEnumConditions(token, config),
    ...buildRelationConditions(token, config.relation),
  ];
}

export function buildWhere(
  query: string,
  config: SearchConfig
): SearchWhereInput {
  const normalizedQuery = normalizeQuery(query);

  // FIX: deduplicate tokens
  const rawTokens = tokenize(normalizedQuery);
  const tokens = Array.from(new Set(rawTokens));

  if (tokens.length === 0) {
    return {};
  }

  const resolvedConfig = createSearchConfig(config);

  return {
    AND: tokens.map((token) => ({
      OR: buildTokenConditions(buildSearchToken(token), resolvedConfig),
    })),
  };
}
