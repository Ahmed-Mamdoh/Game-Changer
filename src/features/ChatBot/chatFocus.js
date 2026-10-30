// Lets any page open the chat about a game (see "Ask about it" on game
// pages) without the chat living inside that page.
let listener = null;

export function askAboutGame(game) {
  listener?.(game);
}

export function onAskAboutGame(handler) {
  listener = handler;
  return () => {
    if (listener === handler) listener = null;
  };
}
