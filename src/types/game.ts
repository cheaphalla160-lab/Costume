export type TargetItemType = 'costume' | 'film';
export type FloorType = 'second floor' | 'third floor';

export interface RoomSpot {
  id: string;
  floor: FloorType;
  roomId: string;
  roomName: string;
  roomNameZh: string;
  spotName: string;
  spotNameZh: string;
  xPercent: number; // relative position within room
  yPercent: number;
  containerType: 'curtain' | 'wardrobe' | 'chest' | 'desk' | 'projector' | 'shelf' | 'stage';
}

export interface ActiveItem {
  id: string;
  type: TargetItemType;
  floor: FloorType;
  spotId: string;
  revealed: boolean;
  peeking: boolean;
  spawnTime: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  costumesFound: number;
  filmsFound: number;
  readingStars: number;
  date: string;
}

export type GameSpeed = 'relaxed' | 'normal' | 'fast' | 'sprint';

export interface GameSettings {
  speed: GameSpeed;
  speedIntervalMs: number;
  bgmVolume: number;
  sfxVolume: number;
  speechRate: number;
  showPhonics: boolean;
  showChinese: boolean;
  mode: 'challenge' | 'freeplay' | 'classroom';
}
