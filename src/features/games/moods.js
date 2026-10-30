import { Coffee, Flame, Ghost, HeartCrack, Orbit } from "lucide-react";

// Browse by how a game feels, not its genre. Each mood is an IGDB where-clause
// built from keywords and themes, checked by hand on real results (Oct 2026):
// "relaxing" alone pulls in Civilization and Rust, "non-linear" pulls in
// Fallout, so each mood narrows with themes or genres it must or can't have.
// `artId` is the game whose art stands for the mood on the home page; it is
// one of the mood's own results.
export const MOODS = [
  {
    key: "emotional",
    name: "Emotional",
    icon: HeartCrack,
    note: "Story games that hit hard: drama with real emotional weight.",
    artId: 22917, // Gris
    // emotional, emotional story/narrative/relationships, heartwarming,
    // depression; Drama theme
    where: "keywords = (2202,51415,49751,57301,28611,5411) & themes = (31)",
  },
  {
    key: "cozy",
    name: "Cozy & low-stakes",
    icon: Coffee,
    note: "Calm, gentle games with nothing chasing you.",
    artId: 17000, // Stardew Valley
    // cozy, cozy adventure, wholesome, farming, farming simulator,
    // heartwarming, relaxing, slice of life; no Action, Horror, Thriller,
    // Survival or Warfare themes; no shooters, RTS or turn-based strategy
    where:
      "keywords = (24685,47482,23931,1103,18437,28611,2084,1430) & themes != (1,19,20,21,39) & genres != (5,11,16)",
  },
  {
    key: "action",
    name: "Brain-off action",
    icon: Flame,
    note: "Big, loud fun: smash things and switch your brain off.",
    artId: 19560, // God of War (2018)
    // destruction, satisfying destruction; or hack and slash with the
    // Action theme
    where: "(keywords = (160,57083) | (genres = (25) & themes = (1)))",
  },
  {
    key: "scary",
    name: "Scary but mild",
    icon: Ghost,
    note: "Eerie and unsettling, without gore or cheap jump scares.",
    artId: 164867, // Dredge
    // Horror theme with spooky, atmospheric, psychological or surreal
    // horror; never gore, gore system, jump scares, survival horror,
    // extreme violence, body horror or dismemberment; no shooters
    where:
      "themes = (19) & keywords = (2940,52461,131,2877) & keywords != (1308,6370,57444,5176,1836,4614,25555,51099) & genres != (5)",
  },
  {
    key: "mind",
    name: "Mind-bending",
    icon: Orbit,
    note: "Puzzles that bend time, space or what you think is real.",
    artId: 9643, // Return of the Obra Dinn
    // time manipulation, time loop, surreal, surrealism, philosophical;
    // Puzzle genre
    where: "keywords = (826,2158,1721,156,25496) & genres = (9)",
  },
];

export const moodOf = (key) => MOODS.find((mood) => mood.key === key) || null;

// The URL without a mood, back to page one
export function withoutMood(searchParams) {
  const next = new URLSearchParams(searchParams);
  next.delete("mood");
  next.delete("page");
  return next;
}

// A mood's clause is a broad vibe, not a tag picked on purpose, so it never
// overrides the player's "Never show" list (see blockedTags.js)
const MOOD_CLAUSES = new Set(MOODS.map((mood) => mood.where));
export const isMoodClause = (filter) => MOOD_CLAUSES.has(filter);
