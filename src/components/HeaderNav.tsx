import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, BookOpen, Presentation } from 'lucide-react';
import { soundCtrl } from '../utils/audio';

interface HeaderNavProps {
  activeTab: 'game' | 'vocab' | 'leaderboard' | 'teacher';
  setActiveTab: (tab: 'game' | 'vocab' | 'leaderboard' | 'teacher') => void;
  isBgmActive: boolean;
  onToggleBgm: () => void;
  score: number;
  streak: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  isBgmActive,
  onToggleBgm,
  score,
  streak,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-xl shadow-xs">
            🔍
          </div>
          <div>
            <a
              href="#game"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('game');
              }}
              className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              Floor Detective: Costume &amp; Film
            </a>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span>Primary English</span>
              <span aria-hidden="true">·</span>
              <span>2nd &amp; 3rd Floor</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-600 font-medium">Interactive Learning</span>
            </div>
          </div>
        </div>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              soundCtrl.playTap();
              setActiveTab('game');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${
              activeTab === 'game'
                ? 'border-amber-500 text-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Play Game (趣味寻宝)
          </button>
          <button
            onClick={() => {
              soundCtrl.playTap();
              setActiveTab('vocab');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${
              activeTab === 'vocab'
                ? 'border-amber-500 text-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Word Cards (核心词汇)
          </button>
          <button
            onClick={() => {
              soundCtrl.playTap();
              setActiveTab('leaderboard');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${
              activeTab === 'leaderboard'
                ? 'border-amber-500 text-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Leaderboard (小侦探榜)
          </button>
          <button
            onClick={() => {
              soundCtrl.playTap();
              setActiveTab('teacher');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-0.5 border-b-2 ${
              activeTab === 'teacher'
                ? 'border-amber-500 text-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Teacher Prep (备课助手)
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live score pill */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium">
            <span className="text-slate-500">Score:</span>
            <span className="text-amber-600 font-bold tabular-nums text-sm">{score}</span>
            {streak > 1 && (
              <span className="text-rose-500 font-bold flex items-center gap-0.5 animate-pulse">
                🔥 x{streak}
              </span>
            )}
          </div>

          {/* BGM Toggle button */}
          <button
            onClick={onToggleBgm}
            title={isBgmActive ? 'Turn off background music' : 'Play cheerful music'}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              isBgmActive
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isBgmActive ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-600 animate-spin-slow" />
                <span className="hidden sm:inline">Music ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Music OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
