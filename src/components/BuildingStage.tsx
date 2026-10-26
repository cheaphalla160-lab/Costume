import React, { useEffect, useState } from 'react';
import { TargetItemType, FloorType, ActiveItem, GameSpeed } from '../types/game';
import {
  ROOM_SPOTS,
  SPEED_CONFIGS,
  THIRD_FLOOR_SCENE_IMG,
  SECOND_FLOOR_SCENE_IMG,
  COSTUME_PROP_IMG,
  FILM_REEL_IMG,
  DETECTIVE_FOX_IMG,
} from '../data/gameData';
import { soundCtrl } from '../utils/audio';
import { Volume2, Sparkles, Film, Shirt, Eye, Layers, Compass } from 'lucide-react';

interface BuildingStageProps {
  speed: GameSpeed;
  isPlaying: boolean;
  onFindItem: (
    itemType: TargetItemType,
    floor: FloorType,
    roomName: string,
    roomNameZh: string,
    spotNameZh: string
  ) => void;
  onMissClick?: () => void;
}

export const BuildingStage: React.FC<BuildingStageProps> = ({
  speed,
  isPlaying,
  onFindItem,
  onMissClick,
}) => {
  const [activeItems, setActiveItems] = useState<ActiveItem[]>([]);
  const [distractorSpotId, setDistractorSpotId] = useState<string | null>(null);
  const [floorViewMode, setFloorViewMode] = useState<'all' | '3F' | '2F'>('all');

  // Spawn and shuffle items across 2F and 3F
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = SPEED_CONFIGS[speed].intervalMs;

    const spawnItems = () => {
      const shuffledSpots = [...ROOM_SPOTS].sort(() => 0.5 - Math.random());
      const newItems: ActiveItem[] = [];

      // Filter spots based on view mode if focused
      const availableSpots =
        floorViewMode === 'all'
          ? shuffledSpots
          : shuffledSpots.filter((s) => (floorViewMode === '3F' ? s.floor === 'third floor' : s.floor === 'second floor'));

      const showCostume = Math.random() < 0.9;
      const showFilm = Math.random() < 0.9;

      let spotIndex = 0;

      if (showCostume && availableSpots[spotIndex]) {
        const spot = availableSpots[spotIndex];
        newItems.push({
          id: `costume-${Date.now()}`,
          type: 'costume',
          floor: spot.floor,
          spotId: spot.id,
          revealed: true,
          peeking: Math.random() > 0.5,
          spawnTime: Date.now(),
        });
        spotIndex++;
      }

      if (showFilm && availableSpots[spotIndex]) {
        const spot = availableSpots[spotIndex];
        newItems.push({
          id: `film-${Date.now()}`,
          type: 'film',
          floor: spot.floor,
          spotId: spot.id,
          revealed: true,
          peeking: Math.random() > 0.5,
          spawnTime: Date.now(),
        });
        spotIndex++;
      }

      // Occasional distractor star
      if (Math.random() < 0.35 && availableSpots[spotIndex]) {
        setDistractorSpotId(availableSpots[spotIndex].id);
      } else {
        setDistractorSpotId(null);
      }

      setActiveItems(newItems);
      soundCtrl.playPop();
    };

    spawnItems();
    const timer = setInterval(spawnItems, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, speed, floorViewMode]);

  const handleItemClick = (e: React.MouseEvent, item: ActiveItem) => {
    e.stopPropagation();
    const spot = ROOM_SPOTS.find((s) => s.id === item.spotId);
    if (!spot) return;

    soundCtrl.playFoundSuccess();
    setActiveItems((prev) => prev.filter((i) => i.id !== item.id));
    onFindItem(item.type, spot.floor, spot.roomName, spot.roomNameZh, spot.spotNameZh);
  };

  const handleSpeakFloor = (floor: 'second floor' | 'third floor') => {
    soundCtrl.playTap();
    soundCtrl.speak(`The ${floor}!`, { rate: 0.8 });
  };

  const thirdFloorSpots = ROOM_SPOTS.filter((s) => s.floor === 'third floor');
  const secondFloorSpots = ROOM_SPOTS.filter((s) => s.floor === 'second floor');

  return (
    <div className="w-full space-y-4">
      {/* Top View Mode Selector & Floor Distinguisher Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              Floor Navigator (楼层导航与视角切换)
            </h3>
            <p className="text-[11px] text-slate-500">
              三楼 3F（电影与胶片）在上方 · 二楼 2F（舞台与戏服）在中间
            </p>
          </div>
        </div>

        {/* View Switch Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => {
              soundCtrl.playTap();
              setFloorViewMode('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              floorViewMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Floors (全楼总览)</span>
          </button>

          <button
            onClick={() => {
              handleSpeakFloor('third floor');
              setFloorViewMode('3F');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              floorViewMode === '3F'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Focus: 3F Third Floor (单看三楼)</span>
          </button>

          <button
            onClick={() => {
              handleSpeakFloor('second floor');
              setFloorViewMode('2F');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              floorViewMode === '2F'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Focus: 2F Second Floor (单看二楼)</span>
          </button>
        </div>
      </div>

      {/* Main Building Frame */}
      <div
        onClick={onMissClick}
        className="w-full bg-slate-900/5 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
      >
        {/* ========================================================
            LEFT COLUMN: Architectural Floor Elevator Shaft (立面电梯轴)
            Clear vertical visual indicator of 3F -> 2F -> 1F!
            ======================================================== */}
        <div className="w-full md:w-36 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-3 flex md:flex-col justify-between items-center border-b-4 md:border-b-0 md:border-r-4 border-amber-300 shrink-0 gap-2">
          {/* Top Title */}
          <div className="hidden md:flex flex-col items-center text-center pb-2 border-b border-slate-700 w-full">
            <span className="text-xl">🏢</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
              ELEVATOR
            </span>
            <span className="text-[9px] text-slate-400">观光电梯</span>
          </div>

          {/* 3F Button & Indicator */}
          <button
            onClick={() => {
              handleSpeakFloor('third floor');
              setFloorViewMode(floorViewMode === '3F' ? 'all' : '3F');
            }}
            className={`w-full p-2.5 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer group ${
              floorViewMode === '3F' || floorViewMode === 'all'
                ? 'bg-indigo-600/90 border-indigo-300 text-white shadow-lg ring-2 ring-indigo-400/50'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-amber-300 tracking-tight">3F</span>
              <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </div>
            <span className="text-[11px] font-extrabold tracking-wide uppercase">
              Third Floor
            </span>
            <span className="text-[10px] text-indigo-200 font-bold">三楼 (放映厅)</span>
            <span className="text-[9px] bg-indigo-900/80 text-amber-300 px-1.5 py-0.5 rounded-full mt-1 font-bold">
              🎬 Target: film
            </span>
          </button>

          {/* Elevator Cable / Arrow Down */}
          <div className="hidden md:flex flex-col items-center opacity-40">
            <div className="w-0.5 h-6 bg-slate-500"></div>
            <span className="text-[10px] text-slate-400 font-bold">▼</span>
          </div>

          {/* 2F Button & Indicator */}
          <button
            onClick={() => {
              handleSpeakFloor('second floor');
              setFloorViewMode(floorViewMode === '2F' ? 'all' : '2F');
            }}
            className={`w-full p-2.5 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer group ${
              floorViewMode === '2F' || floorViewMode === 'all'
                ? 'bg-rose-600/90 border-rose-300 text-white shadow-lg ring-2 ring-rose-400/50'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-amber-300 tracking-tight">2F</span>
              <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </div>
            <span className="text-[11px] font-extrabold tracking-wide uppercase">
              Second Floor
            </span>
            <span className="text-[10px] text-rose-200 font-bold">二楼 (戏服区)</span>
            <span className="text-[9px] bg-rose-900/80 text-amber-300 px-1.5 py-0.5 rounded-full mt-1 font-bold">
              👗 Target: costume
            </span>
          </button>

          {/* Elevator Cable / Arrow Down */}
          <div className="hidden md:flex flex-col items-center opacity-40">
            <div className="w-0.5 h-6 bg-slate-500"></div>
            <span className="text-[10px] text-slate-400 font-bold">▼</span>
          </div>

          {/* 1F Ground Floor Indicator */}
          <div className="w-full p-2 rounded-xl bg-slate-800/40 border border-slate-700 text-slate-400 flex flex-col items-center text-center">
            <span className="text-sm font-black text-slate-300">1F Lobby</span>
            <span className="text-[9px]">一楼迎宾大厅</span>
          </div>
        </div>

        {/* ========================================================
            RIGHT AREA: The Detailed Cutaway Floor Scenes
            ======================================================== */}
        <div className="flex-1 flex flex-col bg-slate-100">
          {/* ======================================================
              FLOOR 3: THIRD FLOOR (三楼)
              ====================================================== */}
          {(floorViewMode === 'all' || floorViewMode === '3F') && (
            <div className="relative border-b-6 border-amber-900/40 bg-indigo-950 flex flex-col">
              {/* Floor Distinct Header Banner */}
              <div
                onClick={() => handleSpeakFloor('third floor')}
                className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-900 text-white px-4 py-2 flex items-center justify-between border-b-2 border-indigo-500 cursor-pointer hover:brightness-110 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-indigo-950 font-black flex items-center justify-center text-base shadow-md">
                    3F
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black tracking-wide uppercase text-white drop-shadow-xs">
                        The Third Floor (三楼)
                      </span>
                      <span className="text-xs bg-indigo-950/70 border border-indigo-400/40 px-2 py-0.5 rounded-full text-amber-300 font-bold hidden sm:inline">
                        Top Floor · 楼顶电影区
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-200">
                      🎬 Film Editing Room &amp; Movie Cinema (胶片剪辑室与影院放映厅)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakFloor('third floor');
                    }}
                    className="px-3 py-1 rounded-lg bg-indigo-500/80 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>读 "third floor"</span>
                  </button>
                </div>
              </div>

              {/* 3F Scene Stage with Hotspots */}
              <div className="relative w-full aspect-16/9 sm:aspect-21/9 overflow-hidden bg-indigo-950">
                <img
                  src={THIRD_FLOOR_SCENE_IMG}
                  alt="3rd Floor Movie Cinema and Film Editing Room"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Overlaid Prominent 3F Watermark Badge */}
                <div className="absolute top-3 left-4 bg-indigo-900/90 text-white border-2 border-amber-400/80 px-3 py-1 rounded-xl backdrop-blur-xs shadow-lg pointer-events-none flex items-center gap-2">
                  <span className="text-amber-300 font-black text-sm sm:text-base">★ 3F · THIRD FLOOR</span>
                  <span className="text-[10px] text-indigo-200 hidden sm:inline">三楼·胶片放映区</span>
                </div>

                {/* Interactive Hotspots on 3F */}
                {thirdFloorSpots.map((spot) => {
                  const activeItem = activeItems.find((i) => i.spotId === spot.id);
                  const isDistractor = distractorSpotId === spot.id;

                  return (
                    <div
                      key={spot.id}
                      style={{
                        left: `${spot.xPercent}%`,
                        top: `${spot.yPercent}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
                    >
                      {activeItem && (
                        <button
                          onClick={(e) => handleItemClick(e, activeItem)}
                          className="group cursor-pointer transform hover:scale-125 active:scale-95 transition-transform"
                          title={`Click to find ${activeItem.type} on the 3rd floor!`}
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-white border-3 border-amber-400 shadow-2xl ring-4 ring-amber-300/80 animate-gentle-bounce flex items-center justify-center overflow-hidden">
                            <img
                              src={activeItem.type === 'costume' ? COSTUME_PROP_IMG : FILM_REEL_IMG}
                              alt={activeItem.type}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>

                          <div className="bg-rose-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-md mt-1 animate-pulse border border-white text-center">
                            Tap {activeItem.type}!
                          </div>
                        </button>
                      )}

                      {!activeItem && isDistractor && (
                        <div className="w-8 h-8 rounded-full bg-amber-400/90 text-white text-sm flex items-center justify-center shadow-md animate-pulse">
                          ⭐
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================
              STAIRS & CONCRETE BEAM SEPARATOR (区分楼层的实木分界横梁)
              ====================================================== */}
          {floorViewMode === 'all' && (
            <div className="bg-amber-950 py-1.5 px-6 text-amber-200 flex items-center justify-between border-y-2 border-amber-800 shadow-inner text-xs font-bold">
              <div className="flex items-center gap-2">
                <span>🪜 Stairs &amp; Floor Slab (楼层分界线)</span>
                <span className="text-[10px] text-amber-400 font-normal">
                  ▲ Up to 3F (上三楼) · ▼ Down to 2F (下二楼)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-amber-300">3F Third Floor</span>
                <span className="text-amber-500">⇄</span>
                <span className="text-rose-300">2F Second Floor</span>
              </div>
            </div>
          )}

          {/* ======================================================
              FLOOR 2: SECOND FLOOR (二楼)
              ====================================================== */}
          {(floorViewMode === 'all' || floorViewMode === '2F') && (
            <div className="relative border-b-6 border-amber-900/40 bg-rose-950 flex flex-col">
              {/* Floor Distinct Header Banner */}
              <div
                onClick={() => handleSpeakFloor('second floor')}
                className="bg-gradient-to-r from-rose-800 via-rose-700 to-rose-900 text-white px-4 py-2 flex items-center justify-between border-b-2 border-rose-500 cursor-pointer hover:brightness-110 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-rose-950 font-black flex items-center justify-center text-base shadow-md">
                    2F
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black tracking-wide uppercase text-white drop-shadow-xs">
                        The Second Floor (二楼)
                      </span>
                      <span className="text-xs bg-rose-950/70 border border-rose-400/40 px-2 py-0.5 rounded-full text-amber-300 font-bold hidden sm:inline">
                        Middle Floor · 中层戏剧区
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-200">
                      🎭 Drama Theater Stage &amp; Costume Wardrobe (戏剧舞台与演出服衣橱)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakFloor('second floor');
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-500/80 hover:bg-rose-400 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>读 "second floor"</span>
                  </button>
                </div>
              </div>

              {/* 2F Scene Stage with Hotspots */}
              <div className="relative w-full aspect-16/9 sm:aspect-21/9 overflow-hidden bg-rose-950">
                <img
                  src={SECOND_FLOOR_SCENE_IMG}
                  alt="2nd Floor Drama Theater Stage and Costume Wardrobe"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Overlaid Prominent 2F Watermark Badge */}
                <div className="absolute top-3 left-4 bg-rose-900/90 text-white border-2 border-amber-400/80 px-3 py-1 rounded-xl backdrop-blur-xs shadow-lg pointer-events-none flex items-center gap-2">
                  <span className="text-amber-300 font-black text-sm sm:text-base">★ 2F · SECOND FLOOR</span>
                  <span className="text-[10px] text-rose-200 hidden sm:inline">二楼·戏服更衣区</span>
                </div>

                {/* Interactive Hotspots on 2F */}
                {secondFloorSpots.map((spot) => {
                  const activeItem = activeItems.find((i) => i.spotId === spot.id);
                  const isDistractor = distractorSpotId === spot.id;

                  return (
                    <div
                      key={spot.id}
                      style={{
                        left: `${spot.xPercent}%`,
                        top: `${spot.yPercent}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
                    >
                      {activeItem && (
                        <button
                          onClick={(e) => handleItemClick(e, activeItem)}
                          className="group cursor-pointer transform hover:scale-125 active:scale-95 transition-transform"
                          title={`Click to find ${activeItem.type} on the 2nd floor!`}
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-white border-3 border-amber-400 shadow-2xl ring-4 ring-amber-300/80 animate-gentle-bounce flex items-center justify-center overflow-hidden">
                            <img
                              src={activeItem.type === 'costume' ? COSTUME_PROP_IMG : FILM_REEL_IMG}
                              alt={activeItem.type}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>

                          <div className="bg-amber-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-md mt-1 animate-pulse border border-white text-center">
                            Tap {activeItem.type}!
                          </div>
                        </button>
                      )}

                      {!activeItem && isDistractor && (
                        <div className="w-8 h-8 rounded-full bg-rose-400/90 text-white text-sm flex items-center justify-center shadow-md animate-pulse">
                          ⭐
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================
              FLOOR 1: GROUND FLOOR LOBBY (一楼大厅底座)
              ====================================================== */}
          <div className="bg-amber-100/90 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-4 border-amber-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-white">
                <img
                  src={DETECTIVE_FOX_IMG}
                  alt="Detective Fox Mascot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-900 bg-amber-300 px-2 py-0.5 rounded shadow-xs">
                    1F First Floor Lobby (一楼大厅)
                  </span>
                  <span className="text-xs text-slate-700 font-bold">
                    Floor Detective Station
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  "Look! <strong className="text-indigo-800">3F (third floor)</strong> is at the top with film &amp; cinema. <strong className="text-rose-800">2F (second floor)</strong> is in the middle with costume &amp; theater!"
                </p>
              </div>
            </div>

            {/* Quick Floor Compare Pill */}
            <div className="flex items-center gap-2 text-xs font-bold shrink-0">
              <button
                onClick={() => handleSpeakFloor('third floor')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>3F: Third Floor (三楼)</span>
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleSpeakFloor('second floor')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>2F: Second Floor (二楼)</span>
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
