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
