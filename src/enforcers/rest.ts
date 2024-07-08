import { keywordsPascalCase } from "../constants.js";
import {
  type Enforcer,
  createBlank,
  getNextToken,
  getPrevToken,
} from "./common.js";
import {
  blankCharacterPredicate,
  commentPredicate,
  everythingPredicate,
  newLinePredicate,
} from "./predicates.js";

export const enforceNoTrailingEmpty: Enforcer = ({ tokens, index, config }) => {
  const token = tokens[index]!;
  if (config.blankCharacters) {
    if (token.content === "\n") {
      const entry = getPrevToken({
        tokens,
        index,
        predicate: (token) =>
          !blankCharacterPredicate(token) || newLinePredicate(token),
      });
      if (entry) {
        tokens.splice(entry.index + 1, entry.tokensAmountBetween);
        return { indexNext: entry.index + 1 };
      }
    } else if (
      index === tokens.length - 1 &&
      token.type === "blank-character"
    ) {
      const entry = getPrevToken({
        tokens,
        index,
        predicate: (token) =>
          !blankCharacterPredicate(token) || newLinePredicate(token),
      });
      if (entry) {
        tokens.splice(entry.index + 1, entry.tokensAmountBetween + 1);
        return { indexNext: entry.index + 1 };
      }
    }
  }
};

export const enforceNewLine: Enforcer = ({ tokens, index, config }) => {
  const token = tokens[index]!;
  const cfg =
    config.newLine?.afterSemicolon && token.content === ";"
      ? config.newLine?.afterSemicolon
      : config.newLine?.afterBegin && token.content.toLowerCase() === "begin"
        ? config.newLine?.afterBegin
        : undefined;

  if (cfg) {
    const entry = getNextToken({
      tokens,
      index,
      predicate: (token) =>
        (cfg.comments === "preserve"
          ? !commentPredicate(token)
          : everythingPredicate(token)) &&
        (!blankCharacterPredicate(token) || newLinePredicate(token)),
    });
    if (entry && entry.token.content !== "\n") {
      tokens.splice(entry.index, 0, { type: "blank-character", content: "\n" });
    }
  }
};

export const enforceNewLineInStructuredStatements: Enforcer = ({
  tokens,
  index,
  config,
}) => {
  const token = tokens[index]!;
  if (
    config.newLine?.inControlFlowStatements &&
    ["then", "else", "do"].includes(token.content.toLowerCase())
  ) {
    const cfg = config.newLine?.inControlFlowStatements;

    const entry = getNextToken({
      tokens,
      index,
      predicate: (token) => !blankCharacterPredicate(token),
    });
    if (
      (cfg.begin === "new-line" &&
        entry &&
        entry.token.content.toLowerCase() === "begin") ||
      (cfg.other === "new-line" &&
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
      tokens.splice(index + 1, entry.tokensAmountBetween, createBlank());
    }
  }
};

export const enforceKeywordsCasing: Enforcer = ({ tokens, index, config }) => {
  const token = tokens[index]!;
  if (config.keywords && token.type === "keyword") {
    const casingStyle =
      config.keywords.override?.[token.content.toLowerCase()] ??
      config.keywords.casing;

    const newContent =
      casingStyle === "lower-case"
        ? token.content.toLowerCase()
        : casingStyle === "upper-case"
          ? token.content.toUpperCase()
          : casingStyle === "pascal-case"
            ? keywordsPascalCase[token.content.toLowerCase()]!
            : token.content;

    tokens[index] = {
      ...token,
      content: newContent,
    };
  }
};
