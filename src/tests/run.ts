import { AssertionError } from "assert";
import type { Test } from "./common.js";
import { parsers } from "./parsers.js";
import { formatters } from "./formatters.js";
import { trailingBlanks } from "./trailing-blanks.js";
import { newLineAfterTokens } from "./new-line-after-tokens.js";
import { newLineInStructuredStatements } from "./new-line-in-structured-statements.js";
import { indent } from "./indent.js";
import { casing } from "./casing.js";

const enforcers: Test[] = [
  ...parsers,
  ...formatters,
  ...trailingBlanks,
  ...newLineAfterTokens,
  ...newLineInStructuredStatements,
  ...indent,
  ...casing,
];

const failedTests = enforcers
  .map((test) => {
    try {
      test.f();
      return null;
    } catch (e) {
      return {
        description: test.description,
        error: e,
      };
    }
  })
  .filter((v): v is NonNullable<typeof v> => !!v);

if (failedTests.length) {
  failedTests.forEach((test) => {
    console.log(test.description);
    console.log(
      test.error instanceof AssertionError ? test.error.stack : test.error,
    );
    console.log();
  });
  console.log(`found ${failedTests.length} failed test(s)`);
} else {
  console.log("no failed tests");
}
