export type SearchFieldPath = string;
export type SearchTextField = SearchFieldPath;
export type SearchRelationField = SearchFieldPath;
export type SearchExactField = SearchFieldPath;

export interface SearchEnumField {
  path: SearchFieldPath;
  values: readonly string[];
}

export interface SearchConfig {
  text: SearchTextField[];
  enum: SearchEnumField[];
  relation: SearchRelationField[];
  exact: SearchExactField[];
}

export interface SearchConfigInput {
  text?: readonly SearchTextField[];
  enum?: readonly SearchEnumField[];
  relation?: readonly SearchRelationField[];
  exact?: readonly SearchExactField[];
}

export interface SearchToken {
  value: string;
  isNumeric: boolean;
  enumValue: string;
}

export interface SearchWhereClause {
  [key: string]: unknown;
}

export interface SearchWhereInput extends SearchWhereClause {
  AND?: SearchWhereClause[];
  OR?: SearchWhereClause[];
}
