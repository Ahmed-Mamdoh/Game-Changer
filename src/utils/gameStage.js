import { BadgeCheck, Construction, FlaskConical, Wrench } from "lucide-react";

// Development stages. `id` is the browse filter's URL value; `statusId` is
// IGDB's game_status for the stages a game can be tagged with.
export const STAGES = [
  { id: "released", name: "Fully released", icon: BadgeCheck },
  { id: "early_access", name: "Early access", icon: Construction, statusId: 4 },
  { id: "beta", name: "Beta", icon: FlaskConical, statusId: 3 },
  { id: "alpha", name: "Alpha", icon: Wrench, statusId: 2 },
];

// The unfinished stage a game is in, or null for released / untagged games
export function stageOf(game) {
  const status = game?.game_status;
  return STAGES.find((s) => s.statusId && s.statusId === status) || null;
}
