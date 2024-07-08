import { deepStrictEqual } from "assert";
import type { Test } from "./common.js";
import { getFormatted, getTokens } from "../main.js";

export const casing: Test[] = [
  {
    description: "enforce lower-case",
    f: () => {
      const textExpected = `
begin
if true then
A := 1;
end.`;
      const text = `
bEgIn
IF true tHen
A := 1;
enD.`;
      const formatted = getFormatted(getTokens(text), {
        keywords: { casing: "lower-case" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "enforce upper-case",
    f: () => {
      const textExpected = `
BEGIN
IF true THEN
A := 1;
END.`;
      const text = `
bEgIn
IF true tHen
A := 1;
enD.`;
      const formatted = getFormatted(getTokens(text), {
        keywords: { casing: "upper-case" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "enforce pascal-case",
    f: () => {
      const textExpected = `
Begin
If true Then
A := 1;
End.`;
      const text = `
bEGIN
IF true tHen
A := 1;
enD.`;
      const formatted = getFormatted(getTokens(text), {
        keywords: { casing: "pascal-case" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "enforce case with override",
    f: () => {
      const textExpected = `
bEGIN
If true then
A := 1;
END.`;
      const text = `
bEGIN
IF true tHen
A := 1;
enD.`;
      const formatted = getFormatted(getTokens(text), {
        keywords: {
          casing: "lower-case",
          override: {
            if: "pascal-case",
            begin: "preserve",
            end: "upper-case",
          },
        },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
];
