import React, { useState } from "react";
import { CharacterState } from "./LottieCharacter";
import { Icon } from "./Icon";
import { AudioWaveVisualizer } from "./AudioWaveVisualizer";

interface CallControlsProps {
  currentState?: CharacterState;
  onStateChange?: (newState: CharacterState) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
  onSendTextQuestion: (text: string) => void;
  onStartVoiceListening: () => void;
  isListening: boolean;
  isThinking: boolean;
  isDarkMode?: boolean;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  onToggleMute,
  onEndCall,
  onSendTextQuestion,
  onStartVoiceListening,
  isListening,
  isThinking,
  isDarkMode = true,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendTextQuestion(inputText.trim());
      setInputText("");
    }
  };

  return (
    <div className="w-full max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-4 pb-2 sm:pb-4 pt-1 z-30 flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
      {/* THINKING SPINNER INDICATOR (3 ANIMATED PINK DOTS) */}
      {isThinking && (
        <div
          className={`flex items-center justify-center gap-2 py-1 px-4 rounded-2xl border-2 border-b-4 border-pink-500 shadow-lg mx-auto w-fit mb-0.5 animate-enter-down ${
            isDarkMode ? "bg-slate-900 text-pink-300" : "bg-white text-pink-600"
          }`}
        >
          <span className="text-xs font-black tracking-wide">Lula está pensando</span>
          <div className="flex items-center gap-1.5 ml-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-2.5 h-2.5 rounded-full bg-pink-300 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      {/* Ask Question Bar (AI Prompt Bar) */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pregúntale a Lula..."
          disabled={isListening || isThinking}
          className={`flex-1 border-2 border-b-4 rounded-2xl px-3.5 py-2 sm:px-4 text-xs font-bold outline-none transition-colors shadow-md disabled:opacity-50 min-w-0 ${
            isDarkMode
              ? "bg-slate-900 border-slate-700 text-white placeholder-slate-400 focus:border-emerald-400"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500"
          }`}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 border-2 border-b-4 border-emerald-700 disabled:bg-slate-800 disabled:border-slate-700 text-slate-950 disabled:text-slate-500 font-black text-xs shadow-md transition-all active:translate-y-0.5 active:border-b-2 cursor-pointer flex items-center gap-1 flex-shrink-0"
        >
          <span>Enviar</span>
          <Icon name="speak" className="w-3.5 h-3.5" colorClass="bg-slate-950" />
        </button>
      </form>

      {/* Main Video Call Action Controls (Flat Gamified 3D Card) */}
      <div
        className={`border-2 border-b-4 rounded-2xl px-3 py-2 shadow-xl flex items-center justify-around gap-2 ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-300 text-slate-900"
        }`}
      >
        {/* Mute Mic Button */}
        <button
          onClick={onToggleMute}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border-2 border-b-4 flex items-center justify-center transition-all duration-150 active:translate-y-0.5 active:border-b-2 cursor-pointer flex-shrink-0 ${
            isMuted
              ? "bg-red-500/20 border-red-500"
              : "bg-emerald-500 border-emerald-700 hover:bg-emerald-400"
          }`}
          title={isMuted ? "Activar Micrófono" : "Silenciar Micrófono"}
        >
          <Icon
            name="microphone"
            className="w-5 h-5"
            colorClass={isMuted ? "bg-red-400" : "bg-slate-950"}
          />
        </button>

        {/* Voice Speech Listener Button */}
        <button
          onClick={onStartVoiceListening}
          disabled={isThinking}
          className={`px-4 h-10 sm:px-5 sm:h-11 rounded-2xl border-2 border-b-4 font-black text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all duration-150 active:translate-y-0.5 active:border-b-2 cursor-pointer flex-shrink-0 ${
            isListening
              ? "bg-amber-400 border-amber-600 text-slate-950 animate-pulse scale-105"
              : "bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-slate-950"
          }`}
        >
          {isListening ? (
            <AudioWaveVisualizer
              isMuted={false}
              isSpeaking={true}
              barCount={4}
              className="h-3.5"
              activeColor="bg-slate-950"
            />
          ) : (
            <Icon
              name="speak"
              className="w-4 h-4 sm:w-5 sm:h-5"
              colorClass="bg-slate-950"
            />
          )}
          <span>{isListening ? "Escuchando..." : "Hablar a Lula"}</span>
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-500 hover:bg-red-400 border-2 border-b-4 border-red-700 text-white flex items-center justify-center shadow-lg transition-all duration-150 active:translate-y-0.5 active:border-b-2 cursor-pointer flex-shrink-0"
          title="Finalizar Llamada"
        >
          <Icon
            name="phone"
            className="w-5 h-5"
            colorClass="bg-white"
          />
        </button>
      </div>
    </div>
  );
};
