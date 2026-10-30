// Models sometimes break the game link format, e.g. **Name**[/games/...],
// Name(/games/...) or a bare (/games/...). These are rebuilt into
// [Name](/games/allGames?search=...) so they render as links.
const BROKEN_LINK =
  /(?:(\*\*|\*|_)([^*_\n[\]]{1,80})\1\s?)?(?<!\])[([](\/games\/allGames\?search=([^)\]\s]+))[)\]]/g;
// "Name[Name](" left over when the name was written before a bare link
const DOUBLED_NAME = /([^\n[\]]{1,80})\[\1\]\(/g;

function searchName(term) {
  try {
    return decodeURIComponent(term.replace(/\+/g, " "));
  } catch {
    return term;
  }
}

export function repairGameLinks(text) {
  return text
    .replace(
      BROKEN_LINK,
      (_, _emphasis, name, url, term) =>
        `[${name?.trim() || searchName(term)}](${url})`,
    )
    .replace(DOUBLED_NAME, "[$1](");
}

// The language of the user's message, so the reply never drifts into another
export function languageOf(text) {
  return /[؀-ۿ]/.test(text) ? "Arabic" : "English";
}

// Models still write the odd wall of text; a paragraph of more than three
// sentences is split into paragraphs of two. Lists, headings and quotes are
// left alone.
const SENTENCE_END = /(?<=[.!?؟])\s+(?=[A-Z؀-ۿ"“*[])/;
const MAX_SENTENCES = 3;

export function splitLongParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((block) => {
      if (/^\s*([-*+>#]|\d+[.)])\s/.test(block) || block.includes("\n"))
        return block;
      const sentences = block.split(SENTENCE_END);
      if (sentences.length <= MAX_SENTENCES) return block;
      const paragraphs = [];
      for (let i = 0; i < sentences.length; i += 2)
        paragraphs.push(sentences.slice(i, i + 2).join(" "));
      return paragraphs.join("\n\n");
    })
    .join("\n\n");
}
