import { Token } from "./matchers.js";

type NewLineConfig = {
  comments: "allow" | "forbid";
};

type Position = "same-line" | "newline";

type NewLineInStructuredStatements = {
  begin?: Position;
  other?: Position;
};

export type Config = {
  trailingBlankCharacters?: undefined | "remove";
  newLineAfterSemicolon?: undefined | NewLineConfig;
  newLineAfterBegin?: undefined | NewLineConfig;
  newLineInStructuredStatments?: undefined | NewLineInStructuredStatements;
};

type Predicate = (token: Token) => boolean;

type Enforcer = (args: {
  tokens: Token[];
  pos: number;
  config: Config;
}) => void | { posNext: number };

type GetToken = (args: {
  tokens: Token[];
  pos: number;
  predicate: Predicate;
}) => {
  index: number;
  tokensAmountBetween: number;
  token: Token;
} | null;

const minusOneToNull = (n: number): number | null => {
  return n === -1 ? null : n;
};

const createBlank = (content: string = " "): Token => {
  return { type: "blank-character", content };
};

const everythingPredicate: Predicate = () => true;

const blankCharacterPredicate: Predicate = (token) => {
  return token.type === "blank-character";
};

const newLinePredicate: Predicate = (token) => {
  return token.content === "\n";
};

const commentPredicate: Predicate = (token) => {
  return ["single-line-comment", "multi-line-comment"].includes(token.type);
};

const getPrevToken: GetToken = ({ tokens, pos, predicate }) => {
  const ind = minusOneToNull(
    tokens.slice(0, pos).reverse().findIndex(predicate),
  );
  if (ind !== null) {
    const index = pos - 1 - ind;
    const token = tokens[index];
    if (token) {
      return { index, tokensAmountBetween: ind, token };
    }
  }
  return null;
};

const getNextToken: GetToken = ({ tokens, pos, predicate }) => {
  const ind = minusOneToNull(tokens.slice(pos + 1).findIndex(predicate));
  if (ind !== null) {
    const index = pos + 1 + ind;
    const token = tokens[index];
    if (token) {
      return { index, tokensAmountBetween: ind, token };
    }
  }
  return null;
};

const enforceNoTrailingEmpty: Enforcer = ({ tokens, pos, config }) => {
  const token = tokens[pos]!;
  if (config.trailingBlankCharacters === "remove") {
    if (token.content === "\n") {
      const entry = getPrevToken({
        tokens,
        pos,
        predicate: (token) =>
          !blankCharacterPredicate(token) || newLinePredicate(token),
      });
      if (entry) {
        tokens.splice(entry.index + 1, entry.tokensAmountBetween);
        return { posNext: entry.index + 1 };
      }
    } else if (pos === tokens.length - 1 && token.type === "blank-character") {
      const entry = getPrevToken({
        tokens,
        pos,
        predicate: (token) =>
          !blankCharacterPredicate(token) || newLinePredicate(token),
      });
      if (entry) {
        tokens.splice(entry.index + 1, entry.tokensAmountBetween + 1);
        return { posNext: entry.index + 1 };
      }
    }
  }
};

const enforceNewLine: Enforcer = ({ tokens, pos, config }) => {
  const token = tokens[pos]!;
  const cfg =
    config.newLineAfterSemicolon && token.content === ";"
      ? config.newLineAfterSemicolon
      : config.newLineAfterBegin && token.content.toLowerCase() === "begin"
        ? config.newLineAfterBegin
        : undefined;

  if (cfg) {
    const entry = getNextToken({
      tokens,
      pos,
      predicate: (token) =>
        (cfg.comments === "allow"
          ? !commentPredicate(token)
          : everythingPredicate(token)) &&
        (!blankCharacterPredicate(token) || newLinePredicate(token)),
    });
    if (entry && entry.token.content !== "\n") {
      tokens.splice(entry.index, 0, { type: "blank-character", content: "\n" });
    }
  }
};

const enforceNewLineInStructuredStatements: Enforcer = ({
  tokens,
  pos,
  config,
}) => {
  const token = tokens[pos]!;
  if (
    config.newLineInStructuredStatments &&
    ["then", "else", "do"].includes(token.content.toLowerCase())
  ) {
    const cfg = config.newLineInStructuredStatments;

    const entry = getNextToken({
      tokens,
      pos,
      predicate: (token) => !blankCharacterPredicate(token),
    });
    if (
      (cfg.begin === "newline" &&
        entry &&
        entry.token.content.toLowerCase() === "begin") ||
      (cfg.other === "newline" &&
        entry &&
        entry.token.content.toLowerCase() !== "begin" &&
        !commentPredicate(entry.token))
    ) {
      tokens.splice(entry.index, 0, createBlank("\n"));
    } else if (
      (cfg.begin === "same-line" &&
        entry &&
        entry.token.content.toLowerCase() === "begin") ||
      (cfg.other === "same-line" &&
        entry &&
        entry.token.content.toLowerCase() !== "begin" &&
        !commentPredicate(entry.token))
    ) {
      tokens.splice(pos + 1, entry.tokensAmountBetween, createBlank());
    }
  }
};

export const enforcers: Enforcer[] = [
  enforceNewLine,
  enforceNewLineInStructuredStatements,
  enforceNoTrailingEmpty,
];
