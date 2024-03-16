import {
  alphabet,
  blankCharacters,
  digits,
  keywords,
  specialDoubleSymbols,
  specialSingleSymbols,
} from "./constants.js";

const isLetterAllowedAsFirstLetterOfVarName = (l: string): boolean => {
  l = l.toLowerCase();
  return alphabet.includes(l) || l === "_";
};

const isLetterAllowedAsTailOfVarName = (l: string): boolean => {
  l = l.toLowerCase();
  return isLetterAllowedAsFirstLetterOfVarName(l) || digits.includes(l);
};

export type TokenType =
  | "blank-character"
  | "string"
  | "single-line-comment"
  | "multi-line-comment"
  | "special-single-symbol"
  | "special-double-symbol"
  | "keyword"
  | "identifier"
  | "number";

export type Token = {
  type: TokenType;
  content: string;
};

type Matcher = (args: { text: string; indexStart: number }) => {
  token: Token;
  indexNext: number;
} | null;

export const getMatch: Matcher = ({ text, indexStart }) => {
  for (const matcher of matchers) {
    const match = matcher({ text, indexStart });
    if (match) {
      return match;
    }
  }
  return null;
};

const blankCharactersMatcher: Matcher = ({ text, indexStart }) => {
  if (!blankCharacters.includes(text[indexStart]!)) {
    return null;
  }

  return {
    token: {
      type: "blank-character",
      content: text[indexStart]!,
    },
    indexNext: indexStart + 1,
  };
};

const stringMatcher: Matcher = ({ text, indexStart }) => {
  if (!(text[indexStart] === "'")) {
    return null;
  }

  let indexEnd = indexStart + 2;
  while (indexEnd < text.length) {
    if (text[indexEnd - 1] === "'") {
      if (text[indexEnd] !== "'") {
        break;
      } else {
        indexEnd++;
      }
    }
    indexEnd++;
  }
  return {
    token: {
      type: "string",
      content: text.slice(indexStart, indexEnd),
    },
    indexNext: indexEnd,
  };
};

const singleLineCommentMatcher: Matcher = ({ text, indexStart }) => {
  if (!(text.slice(indexStart, indexStart + 2) === "//")) {
    return null;
  }

  let indexEnd = indexStart + 2;
  while (indexEnd < text.length && text[indexEnd] !== "\n") {
    indexEnd++;
  }
  return {
    token: {
      type: "single-line-comment",
      content: text.slice(indexStart, indexEnd),
    },
    indexNext: indexEnd,
  };
};

const multiLineCommentMatcher: Matcher = ({ text, indexStart }) => {
  if (
    !(
      text[indexStart] === "{" ||
      text.slice(indexStart, indexStart + 2) === "(*"
    )
  ) {
    return null;
  }

  const closingSymbol = text[indexStart] === "{" ? "}" : "*)";
  let indexEnd = indexStart + 2;
  while (
    indexEnd < text.length &&
    text.slice(indexEnd - closingSymbol.length, indexEnd) !== closingSymbol
  ) {
    indexEnd++;
  }
  return {
    token: {
      type: "multi-line-comment",
      content: text.slice(indexStart, indexEnd),
    },
    indexNext: indexEnd,
  };
};

const specialDoubleSymbolsMatcher: Matcher = ({ text, indexStart }) => {
  if (!specialDoubleSymbols.includes(text.slice(indexStart, indexStart + 2))) {
    return null;
  }

  return {
    token: {
      type: "special-double-symbol",
      content: text.slice(indexStart, indexStart + 2),
    },
    indexNext: indexStart + 2,
  };
};

const specialSingleSymbolsMatcher: Matcher = ({ text, indexStart }) => {
  if (!specialSingleSymbols.includes(text[indexStart]!)) {
    return null;
  }

  return {
    token: {
      type: "special-single-symbol",
      content: text[indexStart]!,
    },
    indexNext: indexStart + 1,
  };
};

const identifierMatcher: Matcher = ({ text, indexStart }) => {
  if (!isLetterAllowedAsFirstLetterOfVarName(text[indexStart]!)) {
    return null;
  }

  let indexEnd = indexStart;
  while (
    indexEnd < text.length &&
    isLetterAllowedAsTailOfVarName(text[indexEnd]!)
  ) {
    indexEnd++;
  }
  const content = text.slice(indexStart, indexEnd);
  const type = keywords.includes(content.toLowerCase())
    ? "keyword"
    : "identifier";
  return { token: { type, content }, indexNext: indexEnd };
};

const numberRegExp = /^[+-]?([0-9]+(\.[0-9]+)?([eE][0-9]+)?|\$[0-9a-fA-F]+)/;

const digitsMatcher: Matcher = ({ text, indexStart }) => {
  const match = text.slice(indexStart).match(numberRegExp);
  if (!match) {
    return null;
  }

  return {
    token: { type: "number", content: match[0] },
    indexNext: indexStart + match[0].length,
  };
};

const matchers: Matcher[] = [
  blankCharactersMatcher,
  stringMatcher,
  singleLineCommentMatcher,
  multiLineCommentMatcher,
  specialDoubleSymbolsMatcher,
  digitsMatcher,
  specialSingleSymbolsMatcher,
  identifierMatcher,
];
