import React, { useState, useEffect } from 'react';
import { TargetItemType, FloorType, GameSpeed } from './types/game';
import { soundCtrl } from './utils/audio';
import { HeaderNav } from './components/HeaderNav';
import { BuildingStage } from './components/BuildingStage';
import { SpeedControls } from './components/SpeedControls';
import { ReadAlongModal } from './components/ReadAlongModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeacherPrepModal } from './components/TeacherPrepModal';
import { VocabStation } from './components/VocabStation';
import { Sparkles, Play, Award, Volume2, ShieldAlert, BookOpen, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'vocab' | 'leaderboard' | 'teacher'>('game');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(false);
  const [speed, setSpeed] = useState<GameSpeed>('normal');
  const [gameMode, setGameMode] = useState<'freeplay' | 'challenge'>('freeplay');
  const [timeRemaining, setTimeRemaining] = useState(60);

  // Gameplay metrics
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [costumesFound, setCostumesFound] = useState(0);
  const [filmsFound, setFilmsFound] = useState(0);
  const [readingStars, setReadingStars] = useState(0);

  // Active found item popup
  const [foundItemData, setFoundItemData] = useState<{
    itemType: TargetItemType;
    floor: FloorType;
    roomName: string;
    roomNameZh: string;
    spotNameZh: string;
  } | null>(null);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [hasStartedFirstTime, setHasStartedFirstTime] = useState(false);

  // 60-Second Challenge Timer
  useEffect(() => {
    let timer: number;
    if (isPlaying && gameMode === 'challenge' && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            soundCtrl.playStarDing();
            confetti({
              particleCount: 70,
              spread: 70,
              origin: { y: 0.5 },
            });
            setIsLeaderboardOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameMode, timeRemaining]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setHasStartedFirstTime(true);
    if (!isBgmActive) {
      soundCtrl.startBgm();
      setIsBgmActive(true);
    }
    soundCtrl.playFoundSuccess();
  };

  const handleToggleBgm = () => {
    const active = soundCtrl.toggleBgm();
    setIsBgmActive(active);
  };

  const handleTogglePlay = () => {
    if (!isPlaying && !hasStartedFirstTime) {
      handleStartGame();
    } else {
      setIsPlaying(!isPlaying);
      if (!isPlaying && !isBgmActive) {
        soundCtrl.startBgm();
        setIsBgmActive(true);
      }
    }
  };

  const handleResetGame = () => {
    setScore(0);
    setStreak(0);
    setCostumesFound(0);
    setFilmsFound(0);
    setReadingStars(0);
    setTimeRemaining(60);
    setIsPlaying(false);
  };

  const handleFindItem = (
    itemType: TargetItemType,
    floor: FloorType,
    roomName: string,
    roomNameZh: string,
    spotNameZh: string
  ) => {
    // Add points
    const streakBonus = streak * 10;
    const gained = 100 + streakBonus;
    setScore((prev) => prev + gained);
    setStreak((prev) => prev + 1);

    if (itemType === 'costume') {
      setCostumesFound((prev) => prev + 1);
    } else {
      setFilmsFound((prev) => prev + 1);
    }

    // Set modal data
    setFoundItemData({
      itemType,
      floor,
      roomName,
      roomNameZh,
      spotNameZh,
    });
  };

  const handleMissClick = () => {
    if (streak > 0) {
      setStreak(0);
    }
  };

  const handleAwardBonus = (points: number) => {
    setScore((prev) => prev + points);
    setReadingStars((prev) => prev + 1);
  };

  const handleSummonItem = (item: TargetItemType, floor: FloorType) => {
    setFoundItemData({
      itemType: item,
      floor: floor,
      roomName: floor === 'second floor' ? 'Costume Wardrobe' : 'Cinema Screening Room',
      roomNameZh: floor === 'second floor' ? '戏剧更衣室' : '影院放映厅',
      spotNameZh: floor === 'second floor' ? '舞台衣橱' : '放映机台',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Bar Contract (Wordmark, Nav links, Primary action) */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'leaderboard') {
            setIsLeaderboardOpen(true);
          } else if (tab === 'teacher') {
            setIsTeacherModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isBgmActive={isBgmActive}
        onToggleBgm={handleToggleBgm}
        score={score}
        streak={streak}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Game Tab */}
        {activeTab === 'game' && (
          <div className="space-y-6">
            {/* Initial Welcome & Quick Start Banner (if not started yet) */}
            {!hasStartedFirstTime && (
              <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/60 shadow-lg shrink-0 bg-white">
                    <img
                      src="/src/assets/images/detective_kid_1793026185913.jpg"
                      alt="Detective Fox"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200 mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Detective Mission · 欢迎来到二楼与三楼寻宝大冒险</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      Find "costume" and "film" on the 2nd &amp; 3rd floors!
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-100 max-w-xl mt-1 leading-relaxed">
                      目标单词：<strong>costume</strong> (戏剧服装), <strong>film</strong> (电影胶卷), <strong>second floor</strong> (二楼), <strong>third floor</strong> (三楼)。
                      找到并点击它们，一起跟着标准发音大声朗读吧！
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartGame}
                  className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 font-extrabold text-sm sm:text-base shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span>Start Adventure (开始探秘)</span>
                </button>
              </div>
            )}

            {/* Speed & Mode Controls Bar */}
            <SpeedControls
              currentSpeed={speed}
              onChangeSpeed={(newSpeed) => setSpeed(newSpeed)}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              gameMode={gameMode}
              onChangeMode={(mode) => {
                setGameMode(mode);
                setTimeRemaining(60);
              }}
              timeRemaining={timeRemaining}
              onResetGame={handleResetGame}
            />

            {/* Interactive Building Stage (3F + 2F + 1F) */}
            <BuildingStage
              speed={speed}
              isPlaying={isPlaying}
              onFindItem={handleFindItem}
              onMissClick={handleMissClick}
            />

            {/* Classroom Stats & Quick Teacher Summon Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold">
                  🎭
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                    Costumes Found
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                    {costumesFound}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
                  🎬
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                    Films Found
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                    {filmsFound}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg font-bold">
                  ⭐
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                    Reading Stars
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                    {readingStars}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold">
                  🔥
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                    Streak Combo
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                    x{streak}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vocab Tab */}
        {activeTab === 'vocab' && (
          <VocabStation
            onStartHunt={() => {
              setActiveTab('game');
              handleStartGame();
            }}
          />
        )}
      </main>

      {/* Pop-up Modals */}

      {/* 1. Read-Along & Pronunciation Modal */}
      {foundItemData && (
        <ReadAlongModal
          isOpen={Boolean(foundItemData)}
          itemType={foundItemData.itemType}
          floor={foundItemData.floor}
          roomName={foundItemData.roomName}
          roomNameZh={foundItemData.roomNameZh}
          spotNameZh={foundItemData.spotNameZh}
          onClose={() => setFoundItemData(null)}
          onAwardBonus={handleAwardBonus}
        />
      )}

      {/* 2. Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentScore={score}
        costumesFound={costumesFound}
        filmsFound={filmsFound}
        readingStars={readingStars}
      />

      {/* 3. Teacher Prep Assistant Modal */}
      <TeacherPrepModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSummonItem={handleSummonItem}
      />

      {/* Child-friendly Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Sunshine English Studio · Primary English Lesson Prep &amp; Game Suite</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="text-amber-600 font-semibold hover:underline cursor-pointer"
            >
              Teacher Prep Mode (备课助手)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="text-amber-600 font-semibold hover:underline cursor-pointer"
            >
              Leaderboard (小侦探榜)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
