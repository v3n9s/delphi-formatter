import { Token, getMatch } from "./matchers.js";

const getTokens = (text: string): Token[] => {
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
