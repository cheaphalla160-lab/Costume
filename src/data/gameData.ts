import { RoomSpot, LeaderboardEntry } from '../types/game';

export const THIRD_FLOOR_SCENE_IMG = '/src/assets/images/third_floor_scene_1793026882705.jpg';
export const SECOND_FLOOR_SCENE_IMG = '/src/assets/images/second_floor_scene_1793026906035.jpg';
export const COSTUME_PROP_IMG = '/src/assets/images/costume_prop_1793026148249.jpg';
export const FILM_REEL_IMG = '/src/assets/images/film_reel_1793026168813.jpg';
export const DETECTIVE_FOX_IMG = '/src/assets/images/detective_kid_1793026185913.jpg';

export const ROOM_SPOTS: RoomSpot[] = [
  // --- THIRD FLOOR (3F) - Cinema & Film Editing ---
  {
    id: 'spot-3-projector',
    floor: 'third floor',
    roomId: 'cinema',
    roomName: 'Movie Cinema Room',
    roomNameZh: '影院放映厅',
    spotName: 'Vintage Movie Projector',
    spotNameZh: '电影放映机台',
    xPercent: 63,
    yPercent: 54,
    containerType: 'projector',
  },
  {
    id: 'spot-3-screen',
    floor: 'third floor',
    roomId: 'cinema',
    roomName: 'Movie Cinema Room',
    roomNameZh: '影院放映厅',
    spotName: 'Magic Movie Screen',
    spotNameZh: '电影大银幕旁',
    xPercent: 88,
    yPercent: 46,
    containerType: 'stage',
  },
  {
    id: 'spot-3-popcorn',
    floor: 'third floor',
    roomId: 'cinema',
    roomName: 'Movie Cinema Room',
    roomNameZh: '影院放映厅',
    spotName: 'Popcorn Cart',
    spotNameZh: '放映厅爆米花车',
    xPercent: 88,
    yPercent: 72,
    containerType: 'chest',
  },
  {
    id: 'spot-3-editing-table',
    floor: 'third floor',
    roomId: 'studio',
    roomName: 'Film Editing Room',
    roomNameZh: '胶片剪辑室',
    spotName: 'Editing Light Table',
    spotNameZh: '胶片剪辑灯光台',
    xPercent: 24,
    yPercent: 64,
    containerType: 'desk',
  },
  {
    id: 'spot-3-film-rack',
    floor: 'third floor',
    roomId: 'studio',
    roomName: 'Film Editing Room',
    roomNameZh: '胶片剪辑室',
    spotName: 'Hanging Film Strips Rack',
    spotNameZh: '彩色胶卷收纳架',
    xPercent: 35,
    yPercent: 44,
    containerType: 'shelf',
  },
  {
    id: 'spot-3-film-poster',
    floor: 'third floor',
    roomId: 'studio',
    roomName: 'Film Editing Room',
    roomNameZh: '胶片剪辑室',
    spotName: 'Film Archive Corner',
    spotNameZh: '胶片海报墙角',
    xPercent: 12,
    yPercent: 56,
    containerType: 'chest',
  },

  // --- SECOND FLOOR (2F) - Theater Stage & Costume Wardrobe ---
  {
    id: 'spot-2-stage',
    floor: 'second floor',
    roomId: 'stage',
    roomName: '2nd Floor Theater Stage',
    roomNameZh: '二楼小剧场舞台',
    spotName: 'Center Stage Spotlight',
    spotNameZh: '剧场舞台中央',
    xPercent: 23,
    yPercent: 62,
    containerType: 'stage',
  },
  {
    id: 'spot-2-curtain',
    floor: 'second floor',
    roomId: 'stage',
    roomName: '2nd Floor Theater Stage',
    roomNameZh: '二楼小剧场舞台',
    spotName: 'Red Stage Velvet Curtain',
    spotNameZh: '红天鹅绒大幕布',
    xPercent: 10,
    yPercent: 45,
    containerType: 'curtain',
  },
  {
    id: 'spot-2-mannequins',
    floor: 'second floor',
    roomId: 'wardrobe',
    roomName: 'Costume & Wardrobe Room',
    roomNameZh: '戏服更衣室',
    spotName: 'King & Princess Mannequins',
    spotNameZh: '王后与国王戏服假人台',
    xPercent: 58,
    yPercent: 78,
    containerType: 'wardrobe',
  },
  {
    id: 'spot-2-dresses-rack',
    floor: 'second floor',
    roomId: 'wardrobe',
    roomName: 'Costume & Wardrobe Room',
    roomNameZh: '戏服更衣室',
    spotName: 'Golden Costume Hangers',
    spotNameZh: '金色戏服挂架',
    xPercent: 65,
    yPercent: 45,
    containerType: 'shelf',
  },
  {
    id: 'spot-2-mirrors',
    floor: 'second floor',
    roomId: 'wardrobe',
    roomName: 'Costume & Wardrobe Room',
    roomNameZh: '戏服更衣室',
    spotName: 'Vanity Dressing Mirrors',
    spotNameZh: '发光明星试衣梳妆镜',
    xPercent: 88,
    yPercent: 72,
    containerType: 'desk',
  },
  {
    id: 'spot-2-hats',
    floor: 'second floor',
    roomId: 'wardrobe',
    roomName: 'Costume & Wardrobe Room',
    roomNameZh: '戏服更衣室',
    spotName: 'Prop Hat & Mask Shelf',
    spotNameZh: '戏剧面具与羽毛帽架',
    xPercent: 66,
    yPercent: 18,
    containerType: 'shelf',
  },
];

export interface TargetWordDetail {
  word: string;
  ipa: string;
  pos: string;
  meaningZh: string;
  exampleSentence: string;
  memoryHook: string;
  audioPrompt: string;
}

export const TARGET_WORDS: Record<string, TargetWordDetail> = {
  costume: {
    word: 'costume',
    ipa: '/ˈkɑːstuːm/',
    pos: 'n. (名词)',
    meaningZh: '戏服，演出服，戏剧服装',
    exampleSentence: 'The shiny costume is on the second floor.',
    memoryHook: '🎭 戏剧登台穿 costume，公主王子最出众！',
    audioPrompt: 'costume. /kɑːstuːm/. The costume is on the second floor.',
  },
  film: {
    word: 'film',
    ipa: '/fɪlm/',
    pos: 'n. (名词)',
    meaningZh: '胶卷，电影胶片，电影',
    exampleSentence: 'The vintage film is on the third floor.',
    memoryHook: '🎬 放映机转动 film，记录精彩好故事！',
    audioPrompt: 'film. /fɪlm/. The film is on the third floor.',
  },
  'second floor': {
    word: 'second floor',
    ipa: '/ˌsekənd ˈflɔːr/',
    pos: 'phrase (词组)',
    meaningZh: '二楼 (2nd floor / 2F)',
    exampleSentence: 'The drama theater and costume room are on the second floor.',
    memoryHook: '🏢 二楼二楼 second floor，华丽戏服满衣橱！',
    audioPrompt: 'second floor. on the second floor.',
  },
  'third floor': {
    word: 'third floor',
    ipa: '/ˌθɜːrd ˈflɔːr/',
    pos: 'phrase (词组)',
    meaningZh: '三楼 (3rd floor / 3F)',
    exampleSentence: 'The movie cinema and film studio are on the third floor.',
    memoryHook: '⭐ 三楼三楼 third floor，放映电影看胶卷！',
    audioPrompt: 'third floor. on the third floor.',
  },
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'rank-1',
    name: 'Lily (小鹿莉莉)',
    avatar: '🦌',
    score: 950,
    costumesFound: 5,
    filmsFound: 4,
    readingStars: 9,
    date: 'Today',
  },
  {
    id: 'rank-2',
    name: 'Tom (小狐狸汤姆)',
    avatar: '🦊',
    score: 820,
    costumesFound: 4,
    filmsFound: 4,
    readingStars: 8,
    date: 'Today',
  },
  {
    id: 'rank-3',
    name: 'Emma (小兔艾玛)',
    avatar: '🐰',
    score: 760,
    costumesFound: 4,
    filmsFound: 3,
    readingStars: 7,
    date: 'Yesterday',
  },
  {
    id: 'rank-4',
    name: 'Lucas (小熊卢卡斯)',
    avatar: '🐻',
    score: 680,
    costumesFound: 3,
    filmsFound: 3,
    readingStars: 6,
    date: 'Yesterday',
  },
  {
    id: 'rank-5',
    name: 'Mia (猫头鹰米亚)',
    avatar: '🦉',
    score: 590,
    costumesFound: 3,
    filmsFound: 2,
    readingStars: 5,
    date: '2 days ago',
  },
];

export const SPEED_CONFIGS = {
  relaxed: {
    label: 'Slow (慢速探索)',
    intervalMs: 4000,
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    desc: '4.0秒换位 · 适合初学观察',
  },
  normal: {
    label: 'Standard (适中标准)',
    intervalMs: 2600,
    badgeColor: 'text-sky-700 bg-sky-50 border-sky-200',
    desc: '2.6秒换位 · 黄金专注节奏',
  },
  fast: {
    label: 'Agile (敏捷挑战)',
    intervalMs: 1600,
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    desc: '1.6秒换位 · 眼疾手快',
  },
  sprint: {
    label: 'Lightning (极速冲刺)',
    intervalMs: 1000,
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
    desc: '1.0秒换位 · 班级PK巅峰对决',
  },
};
