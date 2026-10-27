# Design: Console home

The game art is the color. The interface is a quiet, near-black frame around it, the way a console home screen frames the focused game.

## Principles

1. **Art leads.** Backdrops, covers and screenshots carry all the color. The chrome stays neutral.
2. **One loud thing per screen.** The primary action is a near-white button with dark text. There is never more than one on a screen.
3. **Purple is the brand, not a fill.** Purple marks the logo, the focus ring, the selected cover, links and charts. It is never used as a button fill.
4. **Status lives on icons.** Playing, Played, Dropped and Wishlist each have a colored icon next to neutral text. There are no colored pills.
5. **Logging is one press away.** Every cover has quick status buttons on hover. Every game page has the status control on the backdrop.

## Brand backdrop

Every page sits on the same backdrop (`.ambient` in `src/index.css`): deep brand purple `hsl(262 55% 32%)` at the top of the screen, fading to black at the bottom edge. It is pinned to the screen, so it stays the same however far you scroll. It never moves. On home and game pages the game art sits on top and dissolves into it with `.art-fade`. Panels are 78% opaque so the purple shows through faintly.

## Tokens (`src/index.css`)

| Role | Token | Value |
|---|---|---|
| Page | `bg-base` / `obsidian-950` | `#0c0b10` |
| Surface (panels, rows) | `bg-surface` | `#15131b` |
| Raised (menus, hover) | `bg-raised` | `#1e1b26` |
| Chip | `bg-chip` | `#282433` |
| Hairline | `stroke-subtle` / `stroke-medium` | white 8% / 14% |
| Text: main / dim / muted | `text-main` / `text-dim` / `text-muted` | `#e2dfe8` / `#a29eab` / `#8a8693` |
| Brand purple | `pulse-primary` / `pulse-accent` | `#b9a4ff` / `#c9b8ff` |
| Primary action | `action` / `on-action` | `#f1eef6` / `#120f18` |
| Status | `pulse-success` / `pulse-warning` / `pulse-error` | `#7dd3a0` / `#f0c674` / `#ff8a80` |

- **Type:** Figtree. Weight 400 for reading and 600 for scanning. Weight 800 only on display titles over art (`h1`). Sizes are 12, 14, 16, 20 and 28, plus a display size from `clamp(2.25rem, 5vw, 4rem)`. Numbers that change or line up use `.tabular`.
- **Radius:** 6 (chips, inner controls), 8 (buttons, inputs, covers), 12 (panels), 16 (dialogs).
- **Depth:** depth comes from surface steps and hairlines. `--shadow-float` is only for layers that float: menus, dialogs, toasts and the chat button.
- **Motion:** hover and press feedback is 100–150 ms with no lift or scale. Hero backdrops crossfade over 500 ms. Reduced motion turns everything off.

## Components (`@layer components`)

- `.btn-primary` is the white button, one per screen. `.btn-quiet` is the outline button. `.btn-on-art` is the dark glass button used over images.
- `.link-quiet` is a brand-colored text link with an arrow. Use it for "See all" and other secondary destinations.
- `.segmented` is the status control and the sort control. The selected option takes the white fill.
- `.panel` / `.game-card` is a flat surface with a hairline border. Cards are never nested.

## Surfaces

- **Home:** the console stage. The focused game's art fills the viewport, and the cover shelf below changes the focus (mouse, keyboard focus or arrow keys). Signed-in users see their Playing games first. Under the stage are rows of covers: Free to keep, Coming soon, Most played.
- **Game page:** a full-bleed backdrop with the cover, title, a strip of facts (rating and time to beat), the status control, log/edit buttons, store links and tags. Below it: the summary (65ch), media rail, related shelves, language table and reviews list.
- **Browse pages:** page title with a result count, a filter bar (segmented sort plus dropdown filters), and a dense cover grid.
- **Library (`/account`):** title, a stats strip with hours leading, genre and theme charts, status tabs with counts, and the grid.
