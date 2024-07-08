type PartialWithUndefined<T> = {
  [K in keyof T]?: undefined | T[K];
};

type NewLineAfter = {
  comments: "preserve" | "new-line";
};

type Position = "same-line" | "new-line";

export type Config = PartialWithUndefined<{
  keywords: {
    casing: "lowercase" | "uppercase" | "first-letter-uppercase-rest-lowercase";
  };
  indent: {
    size: number;
    spaceAfterIf?: undefined | "add";
  };
  blankCharacters: {
    trailing: "remove";
  };
  newLine: PartialWithUndefined<{
    afterSemicolon: NewLineAfter;
    afterBegin: NewLineAfter;
    inControlFlowStatements: PartialWithUndefined<{
      begin: Position;
      other: Position;
    }>;
  }>;
}>;
