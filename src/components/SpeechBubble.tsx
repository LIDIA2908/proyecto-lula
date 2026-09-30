import React, { useState } from "react";
import { Icon } from "./Icon";

interface SpeechBubbleProps {
  spanishText: string;
  englishText: string;
  isSpeaking: boolean;
  isThinking?: boolean;
  userTranscript?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  spanishText,
  englishText,
  isSpeaking,
  isThinking,
  userTranscript,
}) => {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="relative max-w-xl lg:max-w-2xl w-full mx-auto px-2 sm:px-4 z-20 flex flex-col gap-1 sm:gap-2">
      {/* User Transcript pill if user just spoke or asked a question */}
      {userTranscript && (
        <div className="self-end bg-slate-800/90 border border-slate-700/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold text-slate-200 shadow-lg flex items-center gap-2 animate-fadeIn max-w-[85%] truncate">
          <span className="text-emerald-400 flex-shrink-0 flex items-center gap-1">
            <Icon name="user" className="w-3.5 h-3.5 text-emerald-400" /> Tú:
          </span>
          <span className="truncate">"{userTranscript}"</span>
        </div>
      )}

      {/* Main Speech Bubble Container */}
      <div className="relative bg-slate-900/95 border-2 border-emerald-500/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-2xl transition-all duration-300 max-h-[24vh] sm:max-h-[28vh] overflow-y-auto">
        {/* Tail Pointer */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-emerald-500/50" />

        <div className="flex items-start gap-2.5 sm:gap-3.5">
          {/* Sound wave / Thinking icon badge */}
          <div
            className={`mt-0.5 flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors shadow-md ${
              isThinking
                ? "bg-amber-500 animate-bounce"
                : isSpeaking
                ? "bg-emerald-500 animate-pulse"
                : "bg-slate-800"
            }`}
          >
            <Icon
              name="speak"
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              colorClass={isThinking || isSpeaking ? "bg-slate-950" : "bg-slate-300"}
            />
          </div>

          <div className="flex-1 min-w-0">
            {isThinking ? (
              <p className="text-sm sm:text-base md:text-lg font-black text-amber-400 tracking-wide animate-pulse flex items-center gap-1.5">
                <span>Elfo pensando respuesta con IA...</span>
                <Icon name="lightning" className="w-4 h-4 text-amber-400" />
              </p>
            ) : (
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white tracking-wide leading-relaxed">
                {spanishText}
              </p>
            )}

            {!isThinking && showTranslation && (
              <div className="text-[11px] sm:text-xs md:text-sm font-semibold text-emerald-400 mt-2 pt-2 border-t border-slate-800 animate-fadeIn flex items-start gap-1.5">
                <Icon name="bulb" className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{englishText}</span>
              </div>
            )}
          </div>
        </div>

        {/* Translation Toggle Pill */}
        {!isThinking && (
          <div className="mt-1.5 sm:mt-2 flex justify-end">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="text-[10px] sm:text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              {showTranslation ? "Ocultar traducción" : "Traducir / Translate"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
