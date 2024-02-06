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

export type Token = {
  type: string;
  content: string;
};

type Matcher = (args: { text: string; posStart: number }) => {
  token: Token;
  posNext: number;
} | null;

export const getMatch: Matcher = ({ text, posStart }) => {
  for (const matcher of matchers) {
    const match = matcher({ text, posStart });
    if (match) {
      return match;
    }
  }
  return null;
};

const blankCharactersMatcher: Matcher = ({ text, posStart }) => {
  if (!blankCharacters.includes(text[posStart]!)) {
    return null;
  }

  return {
    token: {
      type: "blank-character",
      content: text[posStart]!,
    },
    posNext: posStart + 1,
  };
};

const stringMatcher: Matcher = ({ text, posStart }) => {
  if (!(text[posStart] === "'")) {
    return null;
  }

  let posEnd = posStart + 2;
  while (posEnd < text.length) {
    if (text[posEnd - 1] === "'") {
      if (text[posEnd] !== "'") {
        break;
      } else {
        posEnd++;
      }
    }
    posEnd++;
  }
  return {
    token: {
      type: "string",
      content: text.slice(posStart, posEnd),
    },
    posNext: posEnd,
  };
};

const singleLineCommentMatcher: Matcher = ({ text, posStart }) => {
  if (!(text.slice(posStart, posStart + 2) === "//")) {
    return null;
  }

  let posEnd = posStart + 2;
  while (posEnd < text.length && text[posEnd] !== "\n") {
    posEnd++;
  }
  return {
    token: {
      type: "single-line-comment",
      content: text.slice(posStart, posEnd),
    },
    posNext: posEnd,
  };
};

const specialDoubleSymbolsMatcher: Matcher = ({ text, posStart }) => {
  if (!specialDoubleSymbols.includes(text.slice(posStart, posStart + 2))) {
    return null;
  }

  return {
    token: {
      type: "special-double-symbol",
      content: text.slice(posStart, posStart + 2),
    },
    posNext: posStart + 2,
  };
};

const specialSingleSymbolsMatcher: Matcher = ({ text, posStart }) => {
  if (!specialSingleSymbols.includes(text[posStart]!)) {
    return null;
  }

  return {
    token: {
      type: "special-single-symbol",
      content: text[posStart]!,
    },
    posNext: posStart + 1,
  };
};

const identifierMatcher: Matcher = ({ text, posStart }) => {
  if (!isLetterAllowedAsFirstLetterOfVarName(text[posStart]!)) {
    return null;
  }

  let posEnd = posStart;
  while (
    posEnd < text.length &&
    isLetterAllowedAsTailOfVarName(text[posEnd]!)
  ) {
    posEnd++;
  }
  const tokenContent = text.slice(posStart, posEnd);
  let token: Token;
  if (keywords.includes(tokenContent.toLowerCase())) {
    token = { type: "keyword", content: tokenContent.toLowerCase() };
  } else {
    token = { type: "identifier", content: tokenContent };
  }
  return { token, posNext: posEnd };
};

const digitsMatcher: Matcher = ({ text, posStart }) => {
  if (!digits.includes(text[posStart]!)) {
    return null;
  }

  let posEnd = posStart + 1;
  while (posEnd < text.length && digits.includes(text[posEnd]!)) {
    posEnd++;
  }
  return {
    token: { type: "number", content: text.slice(posStart, posEnd) },
    posNext: posEnd,
  };
};

const matchers: Matcher[] = [
  blankCharactersMatcher,
  stringMatcher,
  singleLineCommentMatcher,
  specialDoubleSymbolsMatcher,
  specialSingleSymbolsMatcher,
  identifierMatcher,
  digitsMatcher,
];
