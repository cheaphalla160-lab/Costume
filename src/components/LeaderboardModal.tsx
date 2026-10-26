import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/game';
import { INITIAL_LEADERBOARD } from '../data/gameData';
import { Trophy, Medal, Star, Plus, RotateCcw, X } from 'lucide-react';
import { soundCtrl } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  costumesFound: number;
  filmsFound: number;
  readingStars: number;
  onScoreSaved?: () => void;
}

const AVATAR_OPTIONS = ['🦊', '🐰', '🐼', '🐯', '🐻', '🦌', '🦁', '🦉', '🐱', '🐶'];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentScore,
  costumesFound,
  filmsFound,
  readingStars,
  onScoreSaved,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [hasSaved, setHasSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('floor_detective_leaderboard');
      if (saved) {
        setEntries(JSON.parse(saved));
      } else {
        setEntries(INITIAL_LEADERBOARD);
        localStorage.setItem('floor_detective_leaderboard', JSON.stringify(INITIAL_LEADERBOARD));
      }
    } catch {
      setEntries(INITIAL_LEADERBOARD);
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || hasSaved) return;

    soundCtrl.playStarDing();
    const newEntry: LeaderboardEntry = {
      id: `entry-${Date.now()}`,
      name: playerName.trim(),
      avatar: selectedAvatar,
      score: currentScore,
      costumesFound,
      filmsFound,
      readingStars,
      date: 'Just now',
    };

    const updated = [...entries, newEntry].sort((a, b) => b.score - a.score).slice(0, 15);
    setEntries(updated);
    try {
      localStorage.setItem('floor_detective_leaderboard', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setHasSaved(true);
    onScoreSaved?.();
  };

  const handleResetLeaderboard = () => {
    if (window.confirm('Reset leaderboard to default classroom list? (重置排行榜)')) {
      setEntries(INITIAL_LEADERBOARD);
      localStorage.setItem('floor_detective_leaderboard', JSON.stringify(INITIAL_LEADERBOARD));
      setHasSaved(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Floor Detective Hall of Fame
              </h2>
              <p className="text-xs text-slate-500">小侦探积分排行榜 · 词汇与跟读荣耀榜</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundCtrl.playTap();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Round Score Submission Card */}
        {currentScore > 0 && !hasSaved && (
          <form
            onSubmit={handleSaveScore}
            className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-4 animate-pop-shine"
          >
            <div className="text-xs font-bold text-amber-900 mb-2 flex items-center justify-between">
              <span>🌟 Your Current Record: {currentScore} pts</span>
              <span className="text-[11px] text-amber-700">
                Found {costumesFound} costumes · {filmsFound} films · {readingStars} stars
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Avatar Selector */}
              <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
                {AVATAR_OPTIONS.slice(0, 5).map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg border cursor-pointer transition-transform ${
                      selectedAvatar === av
                        ? 'bg-white border-amber-500 scale-110 shadow-xs'
                        : 'border-transparent hover:bg-white/60'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>

              {/* Name input */}
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter Student Name (学生姓名)"
                maxLength={16}
                required
                className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-auto"
              />

              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs whitespace-nowrap shadow-xs cursor-pointer w-full sm:w-auto"
              >
                Save (入榜)
              </button>
            </div>
          </form>
        )}

        {hasSaved && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-2.5 text-xs font-semibold mb-4 text-center">
            🎉 Score saved successfully! Check your ranking below!
          </div>
        )}

        {/* Leaderboard Table List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {entries.map((entry, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isTop1
                    ? 'bg-amber-50/90 border-amber-300 shadow-xs ring-1 ring-amber-300'
                    : isTop2
                    ? 'bg-slate-50 border-slate-300'
                    : isTop3
                    ? 'bg-orange-50/60 border-orange-200'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className="w-7 text-center font-bold text-sm">
                    {isTop1 && <span className="text-xl">🥇</span>}
                    {isTop2 && <span className="text-xl">🥈</span>}
                    {isTop3 && <span className="text-xl">🥉</span>}
                    {!isTop1 && !isTop2 && !isTop3 && (
                      <span className="text-slate-400 font-mono text-xs">#{index + 1}</span>
                    )}
                  </div>

                  <span className="text-2xl">{entry.avatar}</span>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {entry.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Costume x{entry.costumesFound || 0} · Film x{entry.filmsFound || 0} · ⭐ x{entry.readingStars || 0}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base sm:text-lg font-black text-amber-600 font-mono tabular-nums">
                    {entry.score}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{entry.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={handleResetLeaderboard}
            className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset List (重置榜单)</span>
          </button>

          <span>Top Detectives · Great Readers</span>
        </div>
      </div>
    </div>
  );
};
