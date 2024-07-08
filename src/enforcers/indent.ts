import type { Config } from "../config.js";
import type { Token } from "../matchers.js";
import {
  type Enforcer,
  createBlank,
  getNextToken,
  getPrevToken,
} from "./common.js";
import { blankCharacterPredicate, newLinePredicate } from "./predicates.js";

type IndentTokenCreator = (args: {
  tokens: Token[];
  index: number;
  config: Config;
}) => IndentToken | null;

type IndentToken = Pick<Token, "content"> & {
  activeSinceIndex: number;
  push: (
    this: IndentToken,
    args: { tokens: Token[]; index: number; stack: IndentToken[] },
  ) => void;
  onNextTokenRemoved: (
    this: IndentToken,
    args: { token: IndentToken; stack: IndentToken[] },
  ) => void;
  getIndent: (args: { stack: IndentToken[]; index: number }) => number;
};

const indentTokenCreators: IndentTokenCreator[] = [
  ({ tokens, index, config }) => {
    if (
      !["uses", "const", "var"].includes(tokens[index]!.content.toLowerCase())
    ) {
      return null;
    }

    const nextNewLine = getNextToken({
      tokens,
      index,
      predicate: (token) => newLinePredicate(token),
    });
    return {
      content: tokens[index]!.content,
      activeSinceIndex: nextNewLine ? nextNewLine.index + 1 : tokens.length,
      push: ({ tokens, index, stack }) => {
        if (
          ["uses", "const", "var", "begin"].includes(
            tokens[index]!.content.toLowerCase(),
          )
        ) {
          removeFromStack({ stack });
          pushToStackIfIndentToken({ tokens, index, stack, config });
        }
      },
      onNextTokenRemoved: () => {},
      getIndent: () => {
        return config.indent!.size;
      },
    };
  },
  ({ tokens, index, config }) => {
    if (
      !["then", "else", "do"].includes(tokens[index]!.content.toLowerCase())
    ) {
      return null;
    }

    const state = {
      semicolon: false,
    };
    const nextNewLine = getNextToken({
      tokens,
      index,
      predicate: (token) => newLinePredicate(token),
    });
    return {
      content: tokens[index]!.content,
      activeSinceIndex: nextNewLine ? nextNewLine.index + 1 : tokens.length,
      push({ tokens, index, stack }) {
        const token = tokens[index]!;
        if (
          this.content.toLowerCase() === "then" &&
          token.content.toLowerCase() === "else"
        ) {
          stack.pop();
        } else if (tokens[index - 1]!.content === "\n" && state.semicolon) {
          removeFromStack({ stack });
        }
        if (token.content === ";") {
          state.semicolon = true;
        }
        pushToStackIfIndentToken({ tokens, index, stack, config });
      },
      onNextTokenRemoved: ({ stack, token }) => {
        if (
          ["then", "else", "do", "begin"].includes(token.content.toLowerCase())
        ) {
          removeFromStack({ stack });
        }
      },
      getIndent({ stack, index }) {
        return ["then", "else"].includes(this.content.toLowerCase()) &&
          config.indent!.spaceAfterIf === "add"
          ? 1
          : stack[index + 1]?.content.toLowerCase() === "begin"
            ? 0
            : config.indent!.size;
      },
    };
  },
  ({ tokens, index, config }) => {
    if (tokens[index]!.content.toLowerCase() !== "begin") {
      return null;
    }

    const nextNewLine = getNextToken({
      tokens,
      index,
      predicate: (token) => newLinePredicate(token),
    });
    return {
      content: tokens[index]!.content,
      activeSinceIndex: nextNewLine ? nextNewLine.index + 1 : tokens.length,
      push({ tokens, index, stack }) {
        pushToStackIfIndentToken({ tokens, index, stack, config });
      },
      onNextTokenRemoved: ({ stack, token }) => {
        if (token.content.toLowerCase() === "end") {
          removeFromStack({ stack });
        }
      },
      getIndent: () => {
        return config.indent!.size;
      },
    };
  },
  ({ tokens, index, config }) => {
    if (tokens[index]!.content.toLowerCase() !== "end") {
      return null;
    }

    const state = {
      newLine: false,
    };
    return {
      content: tokens[index]!.content,
      activeSinceIndex: index,
      push: ({ tokens, index, stack }) => {
        if (state.newLine || tokens[index]!.content.toLowerCase() === "end") {
          removeFromStack({ stack });
        }
        if (tokens[index]!.content === "\n") {
          state.newLine = true;
        }
        pushToStackIfIndentToken({ tokens, index, stack, config });
      },
      onNextTokenRemoved: () => {},
      getIndent: () => {
        return -config.indent!.size;
      },
    };
  },
];

export const getIndent = ({
  index,
  stack,
}: {
  index: number;
  stack: IndentToken[];
}): number => {
  let indent = 0;
  stack.forEach((indentToken, i) => {
    if (indentToken.activeSinceIndex <= index) {
      indent += indentToken.getIndent({ stack, index: i });
    }
  });
  return indent;
};

const pushToStackIfIndentToken = ({
  tokens,
  index,
  stack,
  config,
}: {
  tokens: Token[];
  index: number;
  stack: IndentToken[];
  config: Config;
}): void => {
  const indentToken = indentTokenCreators.find((indentTokenCreator) =>
    indentTokenCreator({ tokens, index, config }),
  )?.({ tokens, index, config });
  if (indentToken) {
    stack.push(indentToken);
  }
};

const addToStack = ({
  tokens,
  index,
  stack,
  config,
}: {
  tokens: Token[];
  index: number;
  stack: IndentToken[];
  config: Config;
}): void => {
  const topIndentToken = stack.at(-1);
  if (topIndentToken) {
    topIndentToken.push({ tokens, index, stack });
  } else {
    pushToStackIfIndentToken({ tokens, index, stack, config });
  }
};

const removeFromStack = ({ stack }: { stack: IndentToken[] }): void => {
  const removedIndentToken = stack.pop();
  const topIndentToken = stack.at(-1);
  if (removedIndentToken && topIndentToken) {
    topIndentToken.onNextTokenRemoved({ token: removedIndentToken, stack });
  }
};

export const createIndentEnforcer = (): Enforcer => {
  const stack: IndentToken[] = [];
  return ({ tokens, index, config }) => {
    if (config.indent) {
      const token = tokens[index]!;
      addToStack({ tokens, index, stack, config });
      if (token.content === "\n" || index === tokens.length - 1) {
        const prevNewLine = getPrevToken({
          tokens,
          index,
          predicate: (token) => newLinePredicate(token),
        });
        const prevNewLineIndex = prevNewLine?.index ?? -1;
        const tokenAfterBlanks = getNextToken({
          tokens,
          index: prevNewLineIndex,
          predicate: (token) =>
            !blankCharacterPredicate(token) || newLinePredicate(token),
        });
        const blanksAmount = tokenAfterBlanks?.tokensAmountBetween ?? 0;
        const indent = getIndent({ index, stack });
        tokens.splice(
          prevNewLineIndex + 1,
          blanksAmount,
          ...new Array(indent).fill(undefined).map(() => createBlank()),
        );
        stack.forEach((indentToken) => {
          indentToken.activeSinceIndex += -blanksAmount + indent;
        });
        return { indexNext: index - blanksAmount + indent };
      }
    }
  };
};
