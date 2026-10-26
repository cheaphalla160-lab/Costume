import React from 'react';
import { GameSpeed } from '../types/game';
import { SPEED_CONFIGS } from '../data/gameData';
import { Play, Pause, RotateCcw, Zap, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { soundCtrl } from '../utils/audio';

interface SpeedControlsProps {
  currentSpeed: GameSpeed;
  onChangeSpeed: (speed: GameSpeed) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  gameMode: 'freeplay' | 'challenge';
  onChangeMode: (mode: 'freeplay' | 'challenge') => void;
  timeRemaining?: number;
  onResetGame: () => void;
}

export const SpeedControls: React.FC<SpeedControlsProps> = ({
  currentSpeed,
  onChangeSpeed,
  isPlaying,
  onTogglePlay,
  gameMode,
  onChangeMode,
  timeRemaining = 60,
  onResetGame,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Zone 1: Play/Pause and Reset */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <button
          onClick={() => {
            soundCtrl.playTap();
            onTogglePlay();
          }}
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause (暂停)</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start (开始寻宝)</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            soundCtrl.playTap();
            onResetGame();
          }}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          title="Reset Game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Mode switch: Practice vs 60s Challenge */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              soundCtrl.playTap();
              onChangeMode('freeplay');
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              gameMode === 'freeplay'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Endless Practice
          </button>
          <button
            onClick={() => {
              soundCtrl.playTap();
              onChangeMode('challenge');
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              gameMode === 'challenge'
                ? 'bg-white text-rose-600 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>60s Challenge</span>
          </button>
        </div>

        {gameMode === 'challenge' && (
          <div className="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg text-xs font-bold border border-rose-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" />
            <span className="tabular-nums">{timeRemaining}s</span>
          </div>
        )}
      </div>

      {/* Zone 2: Speed Selector (速度可调) */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Speed (换位速度):</span>
        </span>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
          {(Object.keys(SPEED_CONFIGS) as GameSpeed[]).map((spd) => {
            const config = SPEED_CONFIGS[spd];
            const isSelected = currentSpeed === spd;

            return (
              <button
                key={spd}
                onClick={() => {
                  soundCtrl.playTap();
                  onChangeSpeed(spd);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 scale-102'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={config.desc}
              >
                {config.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
