import React from "react";
import { Icon } from "./Icon";

interface ThemeToggleSwitchProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({
  isDarkMode,
  onToggle,
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      type="button"
      className={`relative inline-flex items-center w-[62px] h-[32px] rounded-full border-2 border-slate-950 transition-colors duration-300 p-[3px] cursor-pointer select-none shadow-md ${
        isDarkMode ? "bg-black" : "bg-orange-500"
      } ${className}`}
      title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      {/* Icon Layer */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none text-white">
        {/* Left Side: Moon icon when dark mode */}
        <span className={`transition-opacity duration-200 ${isDarkMode ? "opacity-100" : "opacity-0"}`}>
          <Icon name="moon" className="w-4 h-4 fill-white text-white" />
        </span>

        {/* Right Side: Sun icon when light mode */}
        <span className={`transition-opacity duration-200 ${!isDarkMode ? "opacity-100" : "opacity-0"}`}>
          <Icon name="sun" className="w-4 h-4 fill-white text-white" />
        </span>
      </div>

      {/* Sliding White Circle Knob */}
      <span
        className={`w-6 h-6 rounded-full bg-white border border-slate-300 shadow-lg transition-transform duration-300 transform pointer-events-none z-10 ${
          isDarkMode ? "translate-x-[30px]" : "translate-x-0"
        }`}
      />
    </button>
  );
};
