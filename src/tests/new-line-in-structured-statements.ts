import { deepStrictEqual } from "assert";
import { getFormatted, getTokens } from "../main.js";
import { Test } from "./common.js";

export const newLineInStructuredStatements: Test[] = [
  {
    description: "expect to do nothing with begin if comment",
    f: () => {
      const text = `if true then // asdf
begin
Valid := false;
end;`;
      const formattedSameLine = getFormatted(getTokens(text), {
        newLineInStructuredStatments: { begin: "same-line" },
      });
      deepStrictEqual(formattedSameLine, text);
      const formattedNewLine = getFormatted(getTokens(text), {
        newLineInStructuredStatments: { begin: "newline" },
      });
      deepStrictEqual(formattedNewLine, text);
    },
  },
  {
    description: "expect to do nothing with statement if comment",
    f: () => {
      const text = `if true then // asdf
Valid := false;`;
      const formattedSameLine = getFormatted(getTokens(text), {
        newLineInStructuredStatments: { other: "same-line" },
      });
      deepStrictEqual(formattedSameLine, text);
      const formattedNewLine = getFormatted(getTokens(text), {
        newLineInStructuredStatments: { other: "newline" },
      });
      deepStrictEqual(formattedNewLine, text);
    },
  },
  {
    description: "expect to move begin on new line",
    f: () => {
      const textExpected = `if true then 
begin
Valid := false;
end;`;
      const text = `if true then begin
Valid := false;
end;`;
      const formatted = getFormatted(getTokens(text), {
        newLineInStructuredStatments: { begin: "newline" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "expect to move statement on new line",
    f: () => {
      const textExpected = `if true then 
Valid := false;`;
      const text = `if true then Valid := false;`;
      const formatted = getFormatted(getTokens(text), {
        newLineInStructuredStatments: { other: "newline" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "expect to move begin on same line",
    f: () => {
      const textExpected = `if true then begin Valid := false;
end;`;
      const text = `if true then
begin Valid := false;
end;`;
      const formatted = getFormatted(getTokens(text), {
        newLineInStructuredStatments: {
          begin: "same-line",
        },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "expect to move single statement on same line",
    f: () => {
      const textExpected = `if true then Valid := false;`;
      const text = `if true then
Valid := false;`;
      const formatted = getFormatted(getTokens(text), {
        newLineInStructuredStatments: {
          other: "same-line",
        },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
];
