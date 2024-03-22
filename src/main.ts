import { enforcers } from "./enforcers.js";
import { Config } from "./enforcers/common.js";
import { Token, getMatch } from "./matchers.js";

export const getTokens = (text: string): Token[] => {
  const tokensList: Token[] = [];
  let indexStart = 0;
  while (indexStart < text.length) {
    const match = getMatch({ text, indexStart });
    if (match) {
      tokensList.push(match.token);
      indexStart = match.indexNext;
    } else {
      throw new Error(
        JSON.stringify(
          {
            indexStart,
            token: text.slice(indexStart, indexStart + 50),
            tokensList: tokensList.slice(-10),
          },
          null,
          2,
        ),
      );
    }
  }
  return tokensList;
};

export const getFormatted = (tokens: Token[], config: Config): string => {
  tokens = [...tokens];
  for (let index = 0; index < tokens.length; index++) {
    enforcers.forEach((f) => {
      const result = f({ tokens, index, config });
      if (result) {
        index = Math.min(tokens.length - 1, result.indexNext);
      }
    });
  }
  return tokens.map((t) => t.content).join("");
};
