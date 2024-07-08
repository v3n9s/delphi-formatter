export const alphabet = new Array(26)
  .fill(undefined)
  .map((v, i) => String.fromCodePoint(97 + i));

export const digits = new Array(10).fill(undefined).map((v, i) => i.toString());

export const blankCharacters = new Array(33)
  .fill(undefined)
  .map((v, i) => String.fromCodePoint(i));

export const specialSingleSymbols = [
  "#",
  "$",
  "&",
  "'",
  "(",
  ")",
  "*",
  "+",
  ",",
  "-",
  ".",
  "/",
  ":",
  ";",
  "<",
  "=",
  ">",
  "@",
  "[",
  "]",
  "^",
  "{",
  "}",
];

export const specialDoubleSymbols = [
  "(*",
  "(.",
  "*)",
  ".)",
  "..",
  "//",
  ":=",
  "<=",
  ">=",
  "<>",
];

export const keywords = [
  "and",
  "array",
  "as",
  "asm",
  "begin",
  "case",
  "class",
  "const",
  "constructor",
  "destructor",
  "dispinterface",
  "div",
  "do",
  "downto",
  "else",
  "end",
  "except",
  "exports",
  "file",
  "finalization",
  "finally",
  "for",
  "function",
  "goto",
  "if",
  "implementation",
  "in",
  "inherited",
  "initialization",
  "inline",
  "interface",
  "is",
  "label",
  "library",
  "mod",
  "nil",
  "not",
  "object",
  "of",
  "or",
  "packed",
  "procedure",
  "program",
  "property",
  "raise",
  "record",
  "repeat",
  "resourcestring",
  "set",
  "shl",
  "shr",
  "string",
  "then",
  "threadvar",
  "to",
  "try",
  "type",
  "unit",
  "until",
  "uses",
  "var",
  "while",
  "with",
  "xor",
];

const getFirstLetterUpperCase = (keyword: string): string => {
  return keyword.slice(0, 1).toUpperCase() + keyword.slice(1);
};

export const keywordsPascalCase: {
  [k: string]: string;
} = {
  ...Object.fromEntries(
    keywords.map((keyword) => [keyword, getFirstLetterUpperCase(keyword)]),
  ),
  dispinterface: "DispInterface",
  downto: "DownTo",
  goto: "GoTo",
  resourcestring: "ResourceString",
  threadvar: "ThreadVar",
};
