import type { Predicate } from "./common.js";

export const everythingPredicate: Predicate = () => true;

export const blankCharacterPredicate: Predicate = (token) => {
  return token.type === "blank-character";
};

export const newLinePredicate: Predicate = (token) => {
  return token.content === "\n";
};

export const commentPredicate: Predicate = (token) => {
  return ["single-line-comment", "multi-line-comment"].includes(token.type);
};
