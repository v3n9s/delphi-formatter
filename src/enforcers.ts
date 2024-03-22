import { Enforcer } from "./enforcers/common.js";
import { createIndentEnforcer } from "./enforcers/indent.js";
import {
  enforceNewLine,
  enforceNewLineInStructuredStatements,
  enforceNoTrailingEmpty,
} from "./enforcers/rest.js";

export const createEnforcers = (): Enforcer[] => {
  return [
    enforceNewLine,
    enforceNewLineInStructuredStatements,
    createIndentEnforcer(),
    enforceNoTrailingEmpty,
  ];
};
