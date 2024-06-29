import { Token } from "../matchers.js";

export type KeywordsConfig = {
  casing: "lowercase" | "uppercase" | "first-letter-uppercase-rest-lowercase";
};

export type IndentConfig = {
  size: number;
  spaceAfterIf?: undefined | "add";
};

export type BlankCharactersConfig = {
  trailing: "remove";
};

export type NewLineConfig = {
  comments: "allow" | "forbid";
};

type Position = "same-line" | "newline";

export type NewLineInStructuredStatements = {
  begin?: Position;
  other?: Position;
};

export type ConfigRequired = {
  keywords: KeywordsConfig;
  indent: IndentConfig;
  blankCharacters: BlankCharactersConfig;
  newLineAfterSemicolon: NewLineConfig;
  newLineAfterBegin: NewLineConfig;
  newLineInStructuredStatments: NewLineInStructuredStatements;
};

export type Config = {
  [K in keyof ConfigRequired]?: undefined | ConfigRequired[K];
};

export type Predicate = (token: Token) => boolean;

export type Enforcer = (args: {
  tokens: Token[];
  index: number;
  config: Config;
}) => void | { indexNext: number };

type GetToken = (args: {
  tokens: Token[];
  index: number;
  predicate: Predicate;
}) => {
  index: number;
  tokensAmountBetween: number;
  token: Token;
} | null;

const minusOneToNull = (n: number): number | null => {
  return n === -1 ? null : n;
};

export const createBlank = (content: string = " "): Token => {
  return { type: "blank-character", content };
};

export const getPrevToken: GetToken = ({ tokens, index, predicate }) => {
  const ind = minusOneToNull(
    tokens.slice(0, index).reverse().findIndex(predicate),
  );
  if (ind !== null) {
    const tokenIndex = index - 1 - ind;
    const token = tokens[tokenIndex];
    if (token) {
      return { index: tokenIndex, tokensAmountBetween: ind, token };
    }
  }
  return null;
};

export const getNextToken: GetToken = ({ tokens, index, predicate }) => {
  const ind = minusOneToNull(tokens.slice(index + 1).findIndex(predicate));
  if (ind !== null) {
    const tokenIndex = index + 1 + ind;
    const token = tokens[tokenIndex];
    if (token) {
      return { index: tokenIndex, tokensAmountBetween: ind, token };
    }
  }
  return null;
};
