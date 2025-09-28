import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const defaultStyles = "border-transparent text-text-general";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          " text-text-general[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        violet: "border-transparent bg-accent-secondary text-text-general",
        darkgray: "border-transparent bg-bg-primary text-text-general",

        "Point-and-click": `${defaultStyles} bg-slate-900`,
        Fighting: `${defaultStyles} bg-red-900`,
        Shooter: `${defaultStyles} bg-orange-900`,
        Music: `${defaultStyles} bg-indigo-900`,
        Platform: `${defaultStyles} bg-emerald-900`,
        Puzzle: `${defaultStyles} bg-teal-900`,
        Racing: `${defaultStyles} bg-yellow-900`,
        "Real Time Strategy (RTS)": `${defaultStyles} bg-purple-900`,
        "Role-playing (RPG)": `${defaultStyles}  bg-accent-secondary`,
        Simulator: `${defaultStyles} bg-cyan-900`,
        Sport: `${defaultStyles} bg-lime-900`,
        Strategy: `${defaultStyles} bg-violet-900`,
        "Turn-based strategy (TBS)": `${defaultStyles} bg-pink-900`,
        Tactical: `${defaultStyles} bg-fuchsia-900`,
        "Hack and slash/Beat 'em up": `${defaultStyles} bg-rose-900`,
        "Quiz/Trivia": `${defaultStyles} bg-amber-900`,
        Pinball: `${defaultStyles} bg-green-900`,
        Adventure: `${defaultStyles} bg-sky-900`,
        Indie: `${defaultStyles} bg-blue-900`,
        Arcade: `${defaultStyles} bg-zinc-900`,
        "Visual Novel": `${defaultStyles} bg-slate-600`,
        "Card & Board Game": `${defaultStyles} bg-neutral-900`,
        MOBA: `${defaultStyles} bg-gray-900`,

        Drama: `${defaultStyles}  bg-slate-950`,
        "Non-fiction": `${defaultStyles}  bg-zinc-950`,
        Sandbox: `${defaultStyles}  bg-stone-950`,
        Educational: `${defaultStyles}  bg-emerald-950`,
        Kids: `${defaultStyles}  bg-cyan-950`,
        "Open world": `${defaultStyles}  bg-indigo-950`,
        Warfare: `${defaultStyles}  bg-red-950`,
        Party: `${defaultStyles}  bg-orange-950`,
        "4X (explore, expand, exploit, and exterminate)": `${defaultStyles}  bg-violet-950`,
        Erotic: `${defaultStyles}  bg-rose-950`,
        Mystery: `${defaultStyles}  bg-purple-950`,
        Action: `${defaultStyles}  bg-blue-950`,
        Fantasy: `${defaultStyles}  bg-fuchsia-950`,
        "Science fiction": `${defaultStyles}  bg-sky-950`,
        Horror: `${defaultStyles}  bg-gray-950`,
        Thriller: `${defaultStyles}  bg-pink-950`,
        Survival: `${defaultStyles}  bg-green-950`,
        Historical: `${defaultStyles}  bg-amber-950`,
        Stealth: `${defaultStyles}  bg-neutral-950`,
        Comedy: `${defaultStyles}  bg-lime-950`,
        Business: `${defaultStyles}  bg-teal-950`,
        Romance: `${defaultStyles}  bg-yellow-950`,

        "Single player": `${defaultStyles} bg-indigo-900`,
        Multiplayer: `${defaultStyles} bg-green-900`,
        "Co-operative": `${defaultStyles} bg-blue-900`,
        "Split screen": `${defaultStyles} bg-yellow-900`,
        "Massively Multiplayer Online (MMO)": `${defaultStyles} bg-purple-900`,
        "Battle Royale": `${defaultStyles} bg-red-900`,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
