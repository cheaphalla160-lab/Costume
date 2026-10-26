import React, { useState } from 'react';
import { TARGET_WORDS } from '../data/gameData';
import { soundCtrl } from '../utils/audio';
import { Volume2, Printer, Sparkles, BookOpen, Music, CheckCircle2, Award, Copy, Check } from 'lucide-react';
import { TargetItemType, FloorType } from '../types/game';

interface TeacherPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSummonItem?: (item: TargetItemType, floor: FloorType) => void;
}

export const TeacherPrepModal: React.FC<TeacherPrepModalProps> = ({
  isOpen,
  onClose,
  onSummonItem,
}) => {
  const [copiedWorksheet, setCopiedWorksheet] = useState(false);
  const [activeSection, setActiveSection] = useState<'cards' | 'chant' | 'plan' | 'worksheet'>('cards');

  if (!isOpen) return null;

  const chantText = `One, two, three, let's explore!
Costume, costume, on the second floor!
Film, film, on the third floor!
Where is the costume? On the second floor!
Where is the film? On the third floor!`;

  const handlePlayChant = () => {
    soundCtrl.speak(chantText, { rate: 0.8 });
  };

  const handleCopyWorksheet = () => {
    const text = `【小学英语趣味课后单 · Floor Detective 探秘任务】
班级: _________  姓名: _________  日期: _________

★ 任务一：认一认，连一连 (Match & Draw)
1. costume        A. 三楼 (3F)
2. film           B. 二楼 (2F)
3. second floor   C. 演出服/戏服
4. third floor    D. 胶卷/电影胶片

★ 任务二：情景选词填空 (Fill in the blanks: costume, film, second, third)
1. Look! The drama actor is wearing a shiny __________.
2. We can watch a movie and roll the __________ on the third floor.
3. The costume wardrobe is on the __________ floor (2F).
4. The cinema screening room is on the __________ floor (3F).

★ 任务三：小侦探大声朗读打卡 (Read aloud to your parents & get 3 stars!)
- "The costume is on the second floor!" [ ⭐ ⭐ ⭐ ]
- "The film is on the third floor!"     [ ⭐ ⭐ ⭐ ]
`;

    navigator.clipboard.writeText(text);
    setCopiedWorksheet(true);
    setTimeout(() => setCopiedWorksheet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border-4 border-amber-300 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xl">
              🍎
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Teacher Prep Assistant (高级备课与授课助手)
              </h2>
              <p className="text-xs text-slate-500">
                专属小学英语教师的备课工作台 · 核心词汇、律动童谣、教学方案与课后单
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveSection('cards')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗂️ 核心词汇卡 (Vocab Cards)
          </button>
          <button
            onClick={() => setActiveSection('chant')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'chant'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎵 律动童谣 (Classroom Chant)
          </button>
          <button
            onClick={() => setActiveSection('plan')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'plan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 5步教学设计 (Lesson Plan)
          </button>
          <button
            onClick={() => setActiveSection('worksheet')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'worksheet'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📝 课后任务单 (Worksheet)
          </button>
        </div>

        {/* Section Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* 1. VOCAB CARDS */}
          {activeSection === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(TARGET_WORDS).map(([key, item]) => (
                <div
                  key={key}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-extrabold text-slate-900 tracking-tight">
                        {item.word}
                      </span>
                      <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {item.ipa}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 mb-1">{item.meaningZh}</p>
                    <p className="text-xs text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 mb-2">
                      {item.memoryHook}
                    </p>
                    <p className="text-xs text-slate-500 italic">"{item.exampleSentence}"</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => soundCtrl.speak(item.audioPrompt, { rate: 0.75 })}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>示范发音</span>
                    </button>

                    {onSummonItem && (
                      <button
                        onClick={() => {
                          if (key === 'costume') onSummonItem('costume', 'second floor');
                          else if (key === 'film') onSummonItem('film', 'third floor');
                          else if (key === 'second floor') onSummonItem('costume', 'second floor');
                          else if (key === 'third floor') onSummonItem('film', 'third floor');
                          onClose();
                        }}
                        className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                      >
                        课堂立即演示 ↗
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. CHANT */}
          {activeSection === 'chant' && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-amber-950">
                    🎵 Floor Detective Rhythmic Chant (课堂动感律动童谣)
                  </h3>
                  <p className="text-xs text-amber-800">
                    全班拍手齐唱，配合身体姿势（戏剧摆造型 + 手摇放映机）强化情境记忆！
                  </p>
                </div>

                <button
                  onClick={handlePlayChant}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>朗读童谣</span>
                </button>
              </div>

              <div className="bg-white rounded-xl p-4 border border-amber-200 font-mono text-sm leading-relaxed text-slate-800 space-y-2">
                <p className="text-amber-700 font-bold">👏 One, two, three, let's explore!</p>
                <p className="text-indigo-700 font-bold">
                  🎭 Costume, costume, on the second floor! <span className="text-slate-400 text-xs font-normal">(摆出戏剧演员酷姿势)</span>
                </p>
                <p className="text-rose-700 font-bold">
                  🎬 Film, film, on the third floor! <span className="text-slate-400 text-xs font-normal">(双手转动电影放映机)</span>
                </p>
                <p className="text-slate-800">
                  ❓ Where is the costume? <strong>On the second floor!</strong>
                </p>
                <p className="text-slate-800">
                  ❓ Where is the film? <strong>On the third floor!</strong>
                </p>
              </div>
            </div>
          )}

          {/* 3. LESSON PLAN */}
          {activeSection === 'plan' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  1. 导入 (Warm-up &amp; Hook · 3 mins)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  播放背景轻音乐，大屏幕展示 Sunshine School 建筑图。向学生提出探秘任务：
                  "Super Detectives! Today we need to find two mystery props in our theater school: a shiny costume and a magic film! Which floors are they hiding on?"
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  2. 探索与呈现 (Floor Exploration · 8 mins)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  分别点击 2F (second floor) 和 3F (third floor)。引导学生观察楼层标志与房间功能（Drama Stage &amp; Cinema Room），
                  通过自然拼读教授 <strong>costume</strong> (/ˈkɑːstuːm/) 和 <strong>film</strong> (/fɪlm/)。
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  3. 句型操练与跟读 (Read-Along &amp; Phonics · 10 mins)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  学生找到物品后点击触发大弹窗，使用 "🐢 Slow" 慢速示范，邀请学生以小侦探身份朗读句子："The costume is on the second floor!" 获得三星评价。
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  4. 游戏PK与挑战赛 (Speed Challenge PK · 12 mins)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  开启 "60s Challenge"，将速度调至 Agile (1.6s) 或 Sprint (1.0s)，分小组轮流在智能白板前寻宝比拼，积分自动计入排行榜。
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  5. 总结与表彰 (Wrap-up &amp; Homework · 7 mins)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  齐唱律动童谣，颁发 "Floor Detective" 电子小侦探勋章，分发配套探秘课后单。
                </p>
              </div>
            </div>
          )}

          {/* 4. WORKSHEET */}
          {activeSection === 'worksheet' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  📝 配套课后练习与朗读打卡单 (Ready-to-Use Printable Task Sheet)
                </h3>
                <button
                  onClick={handleCopyWorksheet}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedWorksheet ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>已复制文本!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>一键复制排版</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-white rounded-xl p-4 border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
{`【小学英语趣味课后单 · Floor Detective 探秘任务】
班级: _________  姓名: _________  日期: _________

★ 任务一：认一认，连一连 (Match & Draw)
1. costume        A. 三楼 (3F)
2. film           B. 二楼 (2F)
3. second floor   C. 演出服/戏服
4. third floor    D. 胶卷/电影胶片

★ 任务二：情景选词填空 (Fill in the blanks: costume, film, second, third)
1. Look! The drama actor is wearing a shiny __________.
2. We can watch a movie and roll the __________ on the third floor.
3. The costume wardrobe is on the __________ floor (2F).
4. The cinema screening room is on the __________ floor (3F).

★ 任务三：小侦探大声朗读打卡 (Read aloud to your parents & get 3 stars!)
- "The costume is on the second floor!" [ ⭐ ⭐ ⭐ ]
- "The film is on the third floor!"     [ ⭐ ⭐ ⭐ ]`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Prepared with care for Primary School English Teaching</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            返回游戏 (Back to Game)
          </button>
        </div>
      </div>
    </div>
  );
};
