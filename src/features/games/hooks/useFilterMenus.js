import {
  Box,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  CircleCheck,
  CircleX,
  Clock,
  Columns2,
  Crosshair,
  Crown,
  Ear,
  Eye,
  Flame,
  Hammer,
  Glasses,
  Globe,
  Handshake,
  ListChecks,
  MonitorSmartphone,
  MoveHorizontal,
  PersonStanding,
  Play,
  ScanEye,
  Shapes,
  Sparkles,
  Star,
  TrendingUp,
  Type,
  User,
  Users,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { STAGES } from "@/utils/gameStage";
import { GENRE_ICONS, PLATFORM_ICONS, THEME_ICONS } from "../ui/filterIcons";
import { parseReleased } from "./useGetFiltersParams";
import { useGetGameModes } from "./useGetGameModes";
import { useGetGenres } from "./useGetGenres";
import { useGetThemes } from "./useGetThemes";

// IGDB game mode ids
const MODE_ICONS = {
  1: User,
  2: Users,
  3: Handshake,
  4: Columns2,
  5: Globe,
  6: Crown,
};

const PLATFORMS = [
  { id: "6", name: "PC" },
  { id: "48", name: "PlayStation 4" },
  { id: "167", name: "PlayStation 5" },
  { id: "49", name: "Xbox One" },
  { id: "169", name: "Xbox Series X|S" },
  { id: "130", name: "Nintendo Switch" },
].map((p) => ({ ...p, icon: PLATFORM_ICONS[p.id] }));

const PERSPECTIVES = [
  { id: "1", name: "First person", icon: Crosshair },
  { id: "2", name: "Third person", icon: PersonStanding },
  { id: "3", name: "Bird view / Isometric", icon: Box },
  { id: "4", name: "Side view", icon: MoveHorizontal },
  { id: "5", name: "Text", icon: Type },
  { id: "6", name: "Auditory", icon: Ear },
  { id: "7", name: "Virtual Reality", icon: Glasses },
  { id: "8", name: "Augmented Reality", icon: ScanEye },
];

const STATUS = [
  { id: "finished", name: "Finished", icon: CircleCheck },
  { id: "playing", name: "Playing", icon: Play },
  { id: "dropped", name: "Dropped", icon: CircleX },
];

// IGDB total_rating runs 0-100
const RATINGS = [
  { id: "90", name: "90+ Exceptional" },
  { id: "80", name: "80+ Great" },
  { id: "70", name: "70+ Good" },
  { id: "60", name: "60+ Decent" },
];

// Year ranges are stored as "from..to"; a range typed by hand that isn't a
// preset joins the list so it can show as picked
function releasedOptions(current) {
  const year = new Date().getFullYear();
  const presets = [
    { id: `${year}..${year}`, name: "This year" },
    { id: `${year - 4}..${year}`, name: "Last 5 years" },
    { id: "2010..2019", name: "2010s" },
    { id: "2000..2009", name: "2000s" },
    { id: "1990..1999", name: "1990s" },
    { id: "1950..1989", name: "Before 1990" },
  ];
  const range = parseReleased(current);
  const id = range && `${range.from}..${range.to}`;
  if (id && !presets.some((p) => p.id === id)) {
    presets.unshift({
      id,
      name:
        range.from === range.to ? `${range.from}` : `${range.from}–${range.to}`,
    });
  }
  return presets;
}

// Upcoming games have no platforms worth filtering yet, and no release date,
// rating or development stage to filter on
export const UPCOMING_FILTERS = {
  isUpcoming: true,
  showPlatform: false,
  showPerspective: false,
  showReleased: false,
  showRating: false,
  showStage: false,
};

export function sortOptions({ isAccount, isUpcoming }) {
  if (isAccount)
    return [
      { id: "hours_played", name: "Hours played", icon: Clock },
      { id: "date_finished", name: "Date finished", icon: CalendarCheck },
    ];
  if (isUpcoming)
    return [
      { id: "hypes", name: "Most hyped", icon: TrendingUp },
      { id: "first_release_date", name: "Soonest", icon: CalendarClock },
    ];
  return [
    { id: "first_release_date", name: "Newest", icon: Sparkles },
    { id: "total_rating_count", name: "Popular", icon: Flame },
  ];
}

// Every filter menu a page shows, in order. Shared by the filter bar, the
// phone sheet, the active-filter chips and the empty state.
export function useFilterMenus({
  showGenres = true,
  showGameModes = true,
  showStatus = false,
  showPlatform = true,
  showPerspective = true,
  showReleased = true,
  showRating = true,
  showStage = true,
} = {}) {
  const [searchParams] = useSearchParams();
  const { data: genres, isLoading: isLoadingGenres } = useGetGenres();
  const { data: themes, isLoading: isLoadingThemes } = useGetThemes();
  const { data: gameModes, isLoading: isLoadingGameModes } = useGetGameModes();

  // Players don't know IGDB's genre/theme split ("Adventure" is a genre,
  // "Action" a theme), so both live in one menu; each keeps its own URL param.
  // Theme 42 is excluded from every query, so it isn't offered either.
  const genreAndTheme = [
    ...(genres || []).map((g) => ({
      ...g,
      param: "genre",
      icon: GENRE_ICONS[g.id],
    })),
    ...(themes || [])
      .filter((t) => t.id !== 42)
      .map((t) => ({ ...t, param: "theme", icon: THEME_ICONS[t.id] })),
  ];

  const menus = [
    showGenres && {
      category: genreAndTheme,
      name: "Genre",
      paramName: "genre",
      icon: Shapes,
      matchable: true,
    },
    showGameModes && {
      category: (gameModes || []).map((m) => ({
        ...m,
        icon: MODE_ICONS[m.id],
      })),
      name: "Mode",
      paramName: "gameMode",
      icon: Users,
      matchable: true,
    },
    showStatus && {
      category: STATUS,
      name: "Status",
      paramName: "status",
      icon: ListChecks,
    },
    showPlatform && {
      category: PLATFORMS,
      name: "Platform",
      paramName: "platform",
      sort: false,
      or: true,
      icon: MonitorSmartphone,
    },
    showPerspective && {
      category: PERSPECTIVES,
      name: "Perspective",
      paramName: "player_perspectives",
      sort: false,
      or: true,
      icon: Eye,
    },
    showReleased && {
      category: releasedOptions(searchParams.get("released")),
      name: "Released",
      paramName: "released",
      sort: false,
      or: true,
      icon: CalendarRange,
      yearRange: true,
    },
    showRating && {
      category: RATINGS,
      name: "Rating",
      paramName: "rating",
      sort: false,
      or: true,
      icon: Star,
    },
    showStage && {
      category: STAGES,
      name: "Stage",
      paramName: "stage",
      sort: false,
      or: true,
      icon: Hammer,
    },
  ].filter(Boolean);

  return {
    menus,
    isLoading: isLoadingGenres || isLoadingThemes || isLoadingGameModes,
  };
}
