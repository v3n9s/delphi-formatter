import { Enforcer } from "./enforcers/common.js";
import {
  enforceNewLine,
  enforceNewLineInStructuredStatements,
  enforceNoTrailingEmpty,
} from "./enforcers/rest.js";

export const enforcers: Enforcer[] = [
  enforceNewLine,
  enforceNewLineInStructuredStatements,
  enforceNoTrailingEmpty,
];
