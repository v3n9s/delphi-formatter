import { deepStrictEqual } from "assert";
import { getFormatted, getTokens } from "../main.js";
import { Test } from "./common.js";

export const newLineAfterTokens: Test[] = [
  {
    description: "expect to add newline, allow comments",
    f: () => {
      const textExpected = `if true then {} begin {}
A := true;
end
else
begin
A := false; {}
end
if true then B := true;`;
      const text = `if true then {} begin {} A := true; end
else
begin A := false; {} end
if true then B := true;`;
      const tokens = getTokens(text);
      deepStrictEqual(
        getFormatted(tokens, {
          newLineAfterBegin: { comments: "allow" },
          newLineAfterSemicolon: { comments: "allow" },
          trailingBlankCharacters: "remove",
        }),
        textExpected,
      );
    },
  },
  {
    description: "expect to add newline, forbid comments",
    f: () => {
      const textExpected = `if true then {} begin
{} A := true;
end
else
begin
A := false;
// asdf
end
if true then B := true;`;
      const text = `if true then {} begin {} A := true; end
else
begin A := false; // asdf
end
if true then B := true;`;
      const tokens = getTokens(text);
      deepStrictEqual(
        getFormatted(tokens, {
          newLineAfterBegin: { comments: "forbid" },
          newLineAfterSemicolon: { comments: "forbid" },
          trailingBlankCharacters: "remove",
        }),
        textExpected,
      );
    },
  },
];
