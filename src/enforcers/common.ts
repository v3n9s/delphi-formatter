import type { Config } from "../config.js";
import type { Token } from "../matchers.js";

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
