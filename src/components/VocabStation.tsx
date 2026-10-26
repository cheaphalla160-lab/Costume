import React, { useState } from 'react';
import { TARGET_WORDS } from '../data/gameData';
import { soundCtrl } from '../utils/audio';
import { Volume2, Sparkles, CheckCircle, ArrowRight, Star } from 'lucide-react';

interface VocabStationProps {
  onStartHunt: () => void;
}

export const VocabStation: React.FC<VocabStationProps> = ({ onStartHunt }) => {
  const [selectedWordKey, setSelectedWordKey] = useState<string>('costume');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizAnswerFeedback, setQuizAnswerFeedback] = useState<string | null>(null);

  const images: Record<string, string> = {
    costume: '/src/assets/images/costume_prop_1793026148249.jpg',
    film: '/src/assets/images/film_reel_1793026168813.jpg',
    'second floor': '/src/assets/images/costume_prop_1793026148249.jpg',
    'third floor': '/src/assets/images/film_reel_1793026168813.jpg',
  };

  const handleSpeak = (text: string, rate = 0.8) => {
    soundCtrl.speak(text, { rate });
  };

  const quizQuestions = [
    {
      question: 'Which item is a theatrical dress or drama actor cape?',
      options: ['costume', 'film', 'third floor'],
      answer: 'costume',
      hint: '戏剧登台穿 costume！',
    },
    {
      question: 'Where can we watch movies with the vintage film?',
      options: ['second floor', 'third floor', 'costume'],
      answer: 'third floor',
      hint: '放映厅在三楼 (the third floor)！',
    },
    {
      question: 'What spins inside a cinema movie projector?',
      options: ['costume', 'film', 'door'],
      answer: 'film',
      hint: '放映机里转动的是胶卷 film！',
    },
  ];

  const handleAnswerQuiz = (selected: string) => {
    const currentQ = quizQuestions[quizQuestionIdx];
    if (selected === currentQ.answer) {
      soundCtrl.playFoundSuccess();
      setQuizAnswerFeedback('🎉 Correct! 答对了！');
      setTimeout(() => {
        setQuizAnswerFeedback(null);
        if (quizQuestionIdx < quizQuestions.length - 1) {
          setQuizQuestionIdx((prev) => prev + 1);
        } else {
          setQuizScore(100);
          soundCtrl.playStarDing();
        }
      }, 1200);
    } else {
      soundCtrl.playTap();
      setQuizAnswerFeedback(`💡 Hint: ${currentQ.hint}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Word Station · 核心词汇特训馆</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Master the 4 Key Words: costume, film, second &amp; third floor!
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            点击卡片倾听标准发音，查看趣味记忆口诀，通过视觉与听觉牢牢记住单词！
          </p>
        </div>

        <button
          onClick={onStartHunt}
          className="mt-4 sm:mt-0 sm:absolute sm:right-8 sm:bottom-8 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-amber-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>进入寻宝游戏</span>
          <ArrowRight className="w-4 h-4 text-amber-600" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(TARGET_WORDS).map(([key, item]) => {
          const isSelected = selectedWordKey === key;
          const img = images[key];

          return (
            <div
              key={key}
              onClick={() => {
                setSelectedWordKey(key);
                soundCtrl.playTap();
              }}
              className={`bg-white rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-400 ring-4 ring-amber-100 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-200 bg-amber-50 shrink-0">
                    <img
                      src={img}
                      alt={item.word}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {item.word}
                      </h3>
                      <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100 font-semibold">
                        {item.ipa}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-700 mt-1">{item.meaningZh}</p>
                    <p className="text-[11px] text-slate-400">{item.pos}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(item.audioPrompt, 0.78);
                      }}
                      className="mt-2 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen (听发音)</span>
                    </button>
                  </div>
                </div>

                {/* Memory Hook Box */}
                <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 font-medium mb-3">
                  {item.memoryHook}
                </div>

                {/* Example sentence */}
                <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Classroom Sentence
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(item.exampleSentence, 0.8);
                      }}
                      className="text-indigo-600 hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>读句子</span>
                    </button>
                  </div>
                  <p className="font-semibold text-slate-800">"{item.exampleSentence}"</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Quiz Interactive Challenge */}
      <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Word Detective Mini Quiz (词汇探秘小测验)
              </h3>
              <p className="text-xs text-slate-500">检验学习成果 · 看看谁是最快答题小侦探</p>
            </div>
          </div>

          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Question {quizQuestionIdx + 1} of {quizQuestions.length}
          </div>
        </div>

        {quizScore === null ? (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <p className="text-sm sm:text-base font-bold text-slate-800 mb-4">
              {quizQuestions[quizQuestionIdx].question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quizQuestions[quizQuestionIdx].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswerQuiz(opt)}
                  className="px-4 py-3 rounded-xl bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 font-bold text-sm text-slate-800 transition-all cursor-pointer shadow-xs text-center"
                >
                  {opt}
                </button>
              ))}
            </div>

            {quizAnswerFeedback && (
              <p className="mt-3 text-xs font-bold text-amber-700 animate-fadeIn">
                {quizAnswerFeedback}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 text-center animate-fadeIn">
            <div className="text-3xl mb-2">🎉 🌟 🏆</div>
            <h4 className="text-lg font-extrabold text-emerald-900">
              Congratulations! All Questions Cleared!
            </h4>
            <p className="text-xs text-emerald-700 mt-1">
              You are officially a Master Floor Detective! Ready to play the hide-and-seek game?
            </p>
            <button
              onClick={onStartHunt}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>Start Game Now (立即寻宝)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
