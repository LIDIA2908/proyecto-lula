import React, { useState, useEffect } from "react";
import { ThemeToggleSwitch } from "./ThemeToggleSwitch";

interface PhoneFrameProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isDarkMode = true,
  onToggleDarkMode,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* IPHONE DISPLAY SCREEN CONTAINER (iPhone Pro Dimensions) */}
      <div
        className={`relative z-10 w-full max-w-[400px] h-[90vh] max-h-[850px] min-h-[640px] rounded-[44px] border-4 shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 ${
          isDarkMode
            ? "bg-slate-950 border-slate-800 text-white"
            : "bg-white border-slate-300 text-slate-900 shadow-slate-300/60"
        }`}
      >
        {/* iOS TOP STATUS BAR WITH DYNAMIC ISLAND & THEME TOGGLE */}
        <div
          className={`relative z-40 h-11 px-5 pt-2 flex items-center justify-between text-xs font-bold tracking-tight select-none flex-shrink-0 transition-colors ${
            isDarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800 border-b border-slate-100"
          }`}
        >
          {/* Clock & Theme Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[13px]">{timeStr || "9:41"}</span>

            {onToggleDarkMode && (
              <ThemeToggleSwitch
                isDarkMode={isDarkMode}
                onToggle={onToggleDarkMode}
                className="scale-75 origin-left"
              />
            )}
          </div>

          {/* Dynamic Island Notch Pill */}
          <div className="w-20 h-5 bg-black rounded-full border border-slate-800 flex items-center justify-end px-2 gap-1.5 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Status Icons: 5G, Battery */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black tracking-wider uppercase">5G</span>
            <div
              className={`w-5 h-2.5 border rounded-[3px] p-[1px] flex items-center ${
                isDarkMode ? "border-slate-300" : "border-slate-700"
              }`}
            >
              <div
                className={`w-full h-full rounded-[1px] ${
                  isDarkMode ? "bg-slate-100" : "bg-slate-800"
                }`}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE SCREEN INNER CONTENT */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col min-h-0">
          {children}
        </div>

        {/* iOS BOTTOM HOME INDICATOR BAR */}
        <div
          className={`relative z-40 h-4 w-full flex items-center justify-center pointer-events-none pb-1 flex-shrink-0 ${
            isDarkMode ? "bg-slate-950" : "bg-white border-t border-slate-100"
          }`}
        >
          <div
            className={`w-28 h-1 rounded-full ${
              isDarkMode ? "bg-slate-700" : "bg-slate-300"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
