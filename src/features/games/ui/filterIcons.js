import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import {
  GiApc,
  GiAura,
  GiBearFace,
  GiBrain,
  GiBrickWall,
  GiBroadsword,
  GiBullets,
  GiCampfire,
  GiCardPlay,
  GiCardRandom,
  GiCastle,
  GiChessKnight,
  GiClick,
  GiCompass,
  GiConsoleController,
  GiCrossedSwords,
  GiCrosshair,
  GiCutDiamond,
  GiCycle,
  GiDiceTwentyFacesTwenty,
  GiDragonHead,
  GiDramaMasks,
  GiDrumKit,
  GiDungeonGate,
  GiEggClutch,
  GiExplosionRays,
  GiFamilyHouse,
  GiFloatingPlatforms,
  GiGears,
  GiGhost,
  GiGraduateCap,
  GiGreekTemple,
  GiHearts,
  GiHood,
  GiHourglass,
  GiJesterHat,
  GiJetFighter,
  GiJigsawBox,
  GiJoystick,
  GiJumpAcross,
  GiKatana,
  GiLoveLetter,
  GiMachineGun,
  GiMagnifyingGlass,
  GiModernCity,
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
  GiQuill,
  GiRaceCar,
  GiRobotGolem,
  GiRocket,
  GiRollingDices,
  GiSandCastle,
  GiSandsOfTime,
  GiShamblingZombie,
  GiSherlockHolmes,
  GiShotgun,
  GiSkullCrossedBones,
  GiSoccerBall,
  GiSpaceship,
  GiSprout,
  GiSpyglass,
  GiStoneTower,
  GiSwordsPower,
  GiTakeMyMoney,
  GiTank,
  GiTargetArrows,
  GiTeapot,
  GiTreasureMap,
  GiTrebuchet,
  GiVillage,
  GiWalkingBoot,
  GiWheat,
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

// Keyed by SUBGENRES id in useGetFiltersParams
export const SUBGENRE_ICONS = {
  1: GiRollingDices, // Roguelike
  2: GiCycle, // Roguelite
  3: GiSkullCrossedBones, // Soulslike
  4: GiTreasureMap, // Metroidvania
  5: GiCardPlay, // Deckbuilder
  6: GiBullets, // Bullet hell
  7: GiModernCity, // City builder
  8: GiStoneTower, // Tower defense
  9: GiShamblingZombie, // Survival horror
  10: GiKatana, // JRPG
  11: GiWalkingBoot, // Walking simulator
  12: GiSherlockHolmes, // Detective
  13: GiDrumKit, // Rhythm
  14: GiDungeonGate, // Dungeon crawler
  15: GiFamilyHouse, // Life sim
  16: GiWheat, // Farming sim
  17: GiJumpAcross, // Precision platformer
  18: GiJigsawBox, // Puzzle platformer
  19: GiSpaceship, // Shoot 'em up
  20: GiConsoleController, // Twin-stick shooter
  21: GiTakeMyMoney, // Tycoon & management
  22: GiSandsOfTime, // Idle & incremental
  23: GiSpyglass, // Hidden object
  24: GiLoveLetter, // Dating sim
  25: GiCutDiamond, // Match 3
  26: GiEggClutch, // Monster taming
  27: GiBrickWall, // Base building
  28: GiRobotGolem, // Mecha
  29: GiJetFighter, // Flight sim
  30: GiSwordsPower, // Auto battler
  31: GiCastle, // Grand strategy
  32: GiTeapot, // Cozy
  33: GiShotgun, // Boomer shooter
  34: GiMachineGun, // Run and gun
  35: GiTargetArrows, // Arena shooter
  36: GiApc, // Vehicular combat
  37: GiQuill, // Interactive fiction
  38: GiAura, // God game
  39: GiVillage, // Colony sim
};

export const PLATFORM_ICONS = {
  6: BsPcDisplay,
  48: FaPlaystation,
  167: FaPlaystation,
  49: FaXbox,
  169: FaXbox,
  130: BsNintendoSwitch,
};
