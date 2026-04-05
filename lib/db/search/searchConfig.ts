import type {
  SearchConfig,
  SearchConfigInput,
  SearchEnumField,
  SearchFieldPath,
} from "./types";

const FIELD_PATH_SEPARATOR = ".";

function dedupe<T>(values: readonly T[]) {
  return [...new Set(values)];
}

function normalizeFieldPath(path: SearchFieldPath) {
  return path.trim();
}

function normalizeFieldPaths(
  paths: readonly SearchFieldPath[],
  options?: { label?: string; requireNested?: boolean }
) {
  return dedupe(paths.map((path) => normalizeFieldPath(path))).map((path) => {
    if (!isValidFieldPath(path, options)) {
      throw new Error(`Invalid ${options?.label ?? "search"} field path: "${path}"`);
    }

    return path;
  });
}

function normalizeEnumField(field: SearchEnumField): SearchEnumField {
  const path = normalizeFieldPath(field.path);
  const values = dedupe(
    field.values
      .map((value) => value.trim().toUpperCase())
      .filter(Boolean)
  );

  if (!isValidFieldPath(path)) {
    throw new Error(`Invalid enum search field path: "${field.path}"`);
  }

  if (values.length === 0) {
    throw new Error(
      `Enum search field "${field.path}" must define at least one value`
    );
  }

  return {
    path,
    values,
  };
}

export function isValidFieldPath(
  path: string,
  options?: { requireNested?: boolean }
) {
  const normalizedPath = normalizeFieldPath(path);

  if (!normalizedPath) {
    return false;
  }

  const segments = normalizedPath.split(FIELD_PATH_SEPARATOR);

  if (options?.requireNested && segments.length < 2) {
    return false;
  }

  return segments.every(Boolean);
}

export function createSearchConfig(
  config: SearchConfigInput = {}
): SearchConfig {
  return {
    text: normalizeFieldPaths(config.text ?? [], {
      label: "text",
    }),
    enum: (config.enum ?? []).map((field) => normalizeEnumField(field)),
    relation: normalizeFieldPaths(config.relation ?? [], {
      label: "relation",
      requireNested: true,
    }),
    exact: normalizeFieldPaths(config.exact ?? [], {
      label: "exact",
    }),
  };
}

export function hasSearchableFields(config: SearchConfig) {
  return (
    config.text.length > 0 ||
    config.enum.length > 0 ||
    config.relation.length > 0 ||
    config.exact.length > 0
  );
}
