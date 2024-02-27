import { deepStrictEqual } from "assert";
import { getTokens } from "../main.js";
import { Test } from "./common.js";

export const parsers: Test[] = [
  {
    description: "expect to correctly parse program text",
    f: () => {
      const tokensExpected = [
        { type: "keyword", content: "if" },
        { type: "blank-character", content: " " },
        { type: "identifier", content: "true" },
        { type: "blank-character", content: " " },
        { type: "keyword", content: "then" },
        { type: "blank-character", content: " " },
        { type: "multi-line-comment", content: "{}" },
        { type: "blank-character", content: " " },
        { type: "keyword", content: "begin" },
        { type: "blank-character", content: " " },
        { type: "multi-line-comment", content: "{}" },
        { type: "blank-character", content: " " },
        { type: "identifier", content: "A" },
        { type: "blank-character", content: " " },
        { type: "special-double-symbol", content: ":=" },
        { type: "blank-character", content: " " },
        { type: "identifier", content: "true" },
        { type: "special-single-symbol", content: ";" },
        { type: "blank-character", content: " " },
        { type: "keyword", content: "end" },
        { type: "blank-character", content: "\n" },
        { type: "keyword", content: "else" },
        { type: "blank-character", content: " " },
        { type: "single-line-comment", content: "// asdf" },
        { type: "blank-character", content: "\n" },
        { type: "keyword", content: "begin" },
        { type: "blank-character", content: " " },
        { type: "identifier", content: "A" },
        { type: "blank-character", content: " " },
        { type: "special-double-symbol", content: ":=" },
        { type: "blank-character", content: " " },
        { type: "identifier", content: "false" },
        { type: "special-single-symbol", content: ";" },
        { type: "blank-character", content: " " },
        { type: "keyword", content: "end" },
        { type: "blank-character", content: "\n" },
        { type: "keyword", content: "if" },
        { type: "blank-character", content: " " },
        { type: "identifier", content: "true" },
        { type: "blank-character", content: " " },
        { type: "keyword", content: "then" },
        { type: "blank-character", content: " " },
        { type: "identifier", content: "B" },
        { type: "blank-character", content: " " },
        { type: "special-double-symbol", content: ":=" },
        { type: "blank-character", content: " " },
        { type: "identifier", content: "true" },
        { type: "special-single-symbol", content: ";" },
      ];
      const text = `if true then {} begin {} A := true; end
else // asdf
begin A := false; end
if true then B := true;`;
      const tokens = getTokens(text);
      deepStrictEqual(tokens, tokensExpected);
    },
  },
];
