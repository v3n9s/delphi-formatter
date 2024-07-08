type PartialWithUndefined<T> = {
  [K in keyof T]?: undefined | T[K];
};

type NewLineAfter = {
  comments: "preserve" | "new-line";
};

type Position = "same-line" | "new-line";

type CasingStyle = "preserve" | "lower-case" | "upper-case" | "pascal-case";

export type Config = PartialWithUndefined<{
  keywords: {
    casing: CasingStyle;
    override?: {
      [keyword: string]: CasingStyle;
    };
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
