import { deepStrictEqual } from "assert";
import { Test } from "./common.js";
import { getFormatted, getTokens } from "../main.js";

export const casing: Test[] = [
  {
    description: "enforce lowercase",
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
        keywords: { casing: "lowercase" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "enforce uppercase",
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
        keywords: { casing: "uppercase" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
  {
    description: "enforce lowercase first letter uppercase",
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
        keywords: { casing: "first-letter-uppercase-rest-lowercase" },
      });
      deepStrictEqual(formatted, textExpected);
    },
  },
];
