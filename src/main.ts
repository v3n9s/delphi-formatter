import { Config, enforcers } from "./enforcers.js";
import { Token, getMatch } from "./matchers.js";

export const getTokens = (text: string): Token[] => {
  const tokensList: Token[] = [];
  let posStart = 0;
  while (posStart < text.length) {
    const match = getMatch({ text, posStart });
    if (match) {
      tokensList.push(match.token);
      posStart = match.posNext;
    } else {
      throw new Error(
        JSON.stringify(
          {
            posStart,
            token: text.slice(posStart, posStart + 50),
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
  for (let pos = 0; pos < tokens.length; pos++) {
    enforcers.forEach((f) => {
      const result = f({ tokens, pos, config });
      if (result) {
        pos = Math.min(tokens.length - 1, result.posNext);
      }
    });
  }
  return tokens.map((t) => t.content).join("");
};
