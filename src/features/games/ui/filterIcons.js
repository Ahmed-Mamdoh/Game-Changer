import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import {
  GiBearFace,
  GiBrain,
  GiBroadsword,
  GiCampfire,
  GiCardRandom,
  GiChessKnight,
  GiClick,
  GiCompass,
  GiCrosshair,
  GiCrossedSwords,
  GiDiceTwentyFacesTwenty,
  GiDragonHead,
  GiDramaMasks,
  GiExplosionRays,
  GiFloatingPlatforms,
  GiGears,
  GiGhost,
  GiGraduateCap,
  GiGreekTemple,
  GiHearts,
  GiHood,
  GiHourglass,
  GiJesterHat,
  GiJoystick,
  GiMagnifyingGlass,
  GiMoneyStack,
  GiMusicalNotes,
  GiNewspaper,
  GiOpenBook,
  GiPartyPopper,
  GiPinballFlipper,
  GiPistolGun,
  GiPlanetConquest,
  GiPulse,
  GiPunch,
  GiPuzzle,
  GiRaceCar,
  GiRocket,
  GiSandCastle,
  GiSoccerBall,
  GiSprout,
  GiTank,
  GiTrebuchet,
  GiWorld,
} from "react-icons/gi";

// Keyed by IGDB id; genres and themes share ids, so they're kept apart
export const GENRE_ICONS = {
  2: GiClick, // Point-and-click
  4: GiPunch, // Fighting
  5: GiPistolGun, // Shooter
  7: GiMusicalNotes, // Music
  8: GiFloatingPlatforms, // Platform
  9: GiPuzzle, // Puzzle
  10: GiRaceCar, // Racing
  11: GiTrebuchet, // Real Time Strategy
  12: GiDiceTwentyFacesTwenty, // Role-playing
  13: GiGears, // Simulator
  14: GiSoccerBall, // Sport
  15: GiChessKnight, // Strategy
  16: GiHourglass, // Turn-based strategy
  24: GiCrosshair, // Tactical
  25: GiBroadsword, // Hack and slash
  26: GiBrain, // Quiz/Trivia
  30: GiPinballFlipper, // Pinball
  31: GiCompass, // Adventure
  32: GiSprout, // Indie
  33: GiJoystick, // Arcade
  34: GiOpenBook, // Visual Novel
  35: GiCardRandom, // Card & Board Game
  36: GiCrossedSwords, // MOBA
};

export const THEME_ICONS = {
  1: GiExplosionRays, // Action
  17: GiDragonHead, // Fantasy
  18: GiRocket, // Science fiction
  19: GiGhost, // Horror
  20: GiPulse, // Thriller
  21: GiCampfire, // Survival
  22: GiGreekTemple, // Historical
  23: GiHood, // Stealth
  27: GiJesterHat, // Comedy
  28: GiMoneyStack, // Business
  31: GiDramaMasks, // Drama
  32: GiNewspaper, // Non-fiction
  33: GiSandCastle, // Sandbox
  34: GiGraduateCap, // Educational
  35: GiBearFace, // Kids
  38: GiWorld, // Open world
  39: GiTank, // Warfare
  40: GiPartyPopper, // Party
  41: GiPlanetConquest, // 4X
  43: GiMagnifyingGlass, // Mystery
  44: GiHearts, // Romance
};

export const PLATFORM_ICONS = {
  6: BsPcDisplay,
  48: FaPlaystation,
  167: FaPlaystation,
  49: FaXbox,
  169: FaXbox,
  130: BsNintendoSwitch,
};
