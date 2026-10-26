import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Mic, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Star } from 'lucide-react';
import { TargetItemType, FloorType } from '../types/game';
import { soundCtrl } from '../utils/audio';
import { TARGET_WORDS } from '../data/gameData';

interface ReadAlongModalProps {
  isOpen: boolean;
  itemType: TargetItemType;
  floor: FloorType;
  roomName: string;
  roomNameZh: string;
  spotNameZh: string;
  onClose: () => void;
  onAwardBonus: (points: number) => void;
}

export const ReadAlongModal: React.FC<ReadAlongModalProps> = ({
  isOpen,
  itemType,
  floor,
  roomName,
  roomNameZh,
  spotNameZh,
  onClose,
  onAwardBonus,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.82);
  const [isRecording, setIsRecording] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);
  const [hasPracticed, setHasPracticed] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);

  const sentence = `The ${itemType} is on the ${floor}!`;
  const sentenceZh =
    itemType === 'costume'
      ? `戏剧服装在${floor === 'second floor' ? '二楼' : '三楼'}！`
      : `电影胶卷在${floor === 'second floor' ? '二楼' : '三楼'}！`;

  const itemImage =
    itemType === 'costume'
      ? '/src/assets/images/costume_prop_1793026148249.jpg'
      : '/src/assets/images/film_reel_1793026168813.jpg';

  const words = ['The', itemType, 'is', 'on', 'the', floor + '!'];

  // Trigger celebratory confetti and auto-read on open
  useEffect(() => {
    if (isOpen) {
      setHasPracticed(false);
      setSpeechFeedback(null);
      setStarCount(0);
      setHighlightedWordIndex(null);

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'],
      });

      // Auto play speech after slight pause
      const timer = setTimeout(() => {
        handleSpeakSentence(0.82);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isOpen, itemType, floor]);

  if (!isOpen) return null;

  const handleSpeakSentence = (rate = 0.82) => {
    setIsPlayingAudio(true);
    soundCtrl.speak(sentence, {
      rate,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => {
        setIsPlayingAudio(false);
        setHighlightedWordIndex(null);
      },
    });
  };

  const handleSpeakWord = (word: string) => {
    soundCtrl.speak(word, { rate: 0.75 });
  };

  // Follow-along speech recognition or interactive recorder
  const handleStartFollowAlong = () => {
    soundCtrl.stopSpeaking();
    setIsRecording(true);
    setSpeechFeedback('Listening... Please read the sentence aloud! 🎙️ (请大声朗读)');

    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;

        recognition.onresult = (event: any) => {
          setIsRecording(false);
          const transcript = event.results[0][0].transcript.toLowerCase();
          evaluateTranscript(transcript);
        };

        recognition.onerror = () => {
          simulateReadingSuccess();
        };

        recognition.start();

        // Safety timeout
        setTimeout(() => {
          if (isRecording) {
            simulateReadingSuccess();
          }
        }, 4000);
      } catch {
        simulateReadingSuccess();
      }
    } else {
      simulateReadingSuccess();
    }
  };

  const simulateReadingSuccess = () => {
    setTimeout(() => {
      setIsRecording(false);
      awardSuccessStars('Great job reading aloud! 🌟 发音响亮，超级棒！');
    }, 1800);
  };

  const evaluateTranscript = (transcript: string) => {
    const targetWord = itemType.toLowerCase();
    const targetFloorWord = floor.includes('second') ? 'second' : 'third';

    const hasItem = transcript.includes(targetWord);
    const hasFloor = transcript.includes(targetFloorWord) || transcript.includes('floor');

    if (hasItem && hasFloor) {
      awardSuccessStars(`Super Star! Recognized: "${transcript}" ⭐⭐⭐ 完美发音！`);
    } else if (hasItem || hasFloor) {
      awardSuccessStars(`Good effort! Recognized: "${transcript}" ⭐⭐ 读得很清晰！`);
    } else {
      awardSuccessStars(`Well tried! Let's listen once more. ⭐ 勇于开口，继续加油！`);
    }
  };

  const awardSuccessStars = (feedback: string) => {
    soundCtrl.playStarDing();
    setStarCount(3);
    setSpeechFeedback(feedback);
    setHasPracticed(true);
    onAwardBonus(50);

    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#FBBF24', '#F43F5E'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative overflow-hidden">
        {/* Top Badge: Discovery info */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Found on the {floor === 'second floor' ? '2nd Floor (二楼)' : '3rd Floor (三楼)'}
            </span>
            <span className="text-xs text-slate-500">
              {roomNameZh} · {spotNameZh}
            </span>
          </div>

          <button
            onClick={() => {
              soundCtrl.stopSpeaking();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Box with Item Image & Text */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-amber-200 bg-amber-50 shadow-md shrink-0 relative group">
            <img
              src={itemImage}
              alt={itemType}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 shadow-xs">
              {itemType}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-semibold tracking-wide uppercase text-amber-600 mb-1">
              ✨ Read &amp; Speak Along (跟读时间)
            </div>

            {/* Target English Sentence */}
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              <span>The </span>
              <button
                onClick={() => handleSpeakWord(itemType)}
                className="text-amber-600 underline decoration-amber-400 decoration-wavy underline-offset-4 hover:text-amber-700 cursor-pointer inline-block transform hover:scale-105 transition-transform"
                title={`Click to hear "${itemType}"`}
              >
                {itemType}
              </button>
              <span> is on </span>
              <button
                onClick={() => handleSpeakWord(floor)}
                className="text-indigo-600 underline decoration-indigo-400 decoration-wavy underline-offset-4 hover:text-indigo-700 cursor-pointer inline-block transform hover:scale-105 transition-transform"
                title={`Click to hear "${floor}"`}
              >
                the {floor}!
              </button>
            </div>

            {/* Chinese Translation */}
            <p className="text-sm font-medium text-slate-500 mt-2">
              {sentenceZh}
            </p>

            {/* Phonetic Pronunciation Chips */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono">
                {itemType}: {TARGET_WORDS[itemType]?.ipa}
              </span>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-mono border border-indigo-100">
                {floor}: {TARGET_WORDS[floor]?.ipa}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar: Listen & Follow-along */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSpeakSentence(0.82)}
                disabled={isPlayingAudio}
                className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white shadow-md animate-pulse'
                    : 'bg-white text-slate-800 border border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <Volume2 className="w-4 h-4 text-amber-500" />
                <span>{isPlayingAudio ? 'Speaking...' : 'Listen (听发音)'}</span>
              </button>

              <button
                onClick={() => handleSpeakSentence(0.65)}
                disabled={isPlayingAudio}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Listen in slow speed for primary learners"
              >
                🐢 Slow (慢速示范)
              </button>
            </div>

            {/* Follow-along reading button */}
            <button
              onClick={handleStartFollowAlong}
              disabled={isRecording}
              className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isRecording
                  ? 'bg-rose-500 text-white animate-bounce'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-95'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? 'Listening...' : '🎤 I Can Read! (我来跟读)'}</span>
            </button>
          </div>

          {/* Reading Feedback & Stars */}
          {speechFeedback && (
            <div className="mt-3 pt-3 border-t border-slate-200 text-center animate-fadeIn">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= starCount
                        ? 'text-amber-400 fill-amber-400 animate-bounce'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-700">{speechFeedback}</p>
              {hasPracticed && (
                <span className="text-[11px] text-emerald-600 font-bold mt-0.5 inline-block">
                  +50 Star Reader Bonus Awarded! 🌟
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA to continue */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Finding +100 pts · Follow-along +50 pts</span>
          </div>

          <button
            onClick={() => {
              soundCtrl.playTap();
              soundCtrl.stopSpeaking();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <span>Continue Hunting (继续寻宝)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
