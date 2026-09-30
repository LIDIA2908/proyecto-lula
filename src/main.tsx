import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { PhoneFrame } from "./components/PhoneFrame";
import { LulaDialerScreen } from "./components/LulaDialerScreen";
import { LulaVideoCall } from "./components/LulaVideoCall";
import { StateMachineScreen } from "./components/StateMachineScreen";

type AppView = "dialer" | "call" | "state-machine";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>("dialer");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  return (
    <PhoneFrame isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}>
      {currentView === "dialer" && (
        <LulaDialerScreen
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onStartCall={() => setCurrentView("call")}
          onVisitStateMachine={() => setCurrentView("state-machine")}
        />
      )}
      {currentView === "call" && (
        <LulaVideoCall
          isDarkMode={isDarkMode}
          onReturnToDialer={() => setCurrentView("dialer")}
          onVisitStateMachine={() => setCurrentView("state-machine")}
        />
      )}
      {currentView === "state-machine" && (
        <StateMachineScreen
          isDarkMode={isDarkMode}
          onReturnToCall={() => setCurrentView("call")}
          onReturnToDialer={() => setCurrentView("dialer")}
        />
      )}
    </PhoneFrame>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
