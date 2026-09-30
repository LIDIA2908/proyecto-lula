import React, { useState } from "react";
import { Player } from "@remotion/player";
import { OnboardingBannerComposition } from "../remotion/OnboardingBannerComposition";
import { RemotionTechComposition } from "../remotion/RemotionTechComposition";
import { RemotionAIEngineComposition } from "../remotion/RemotionAIEngineComposition";
import { Icon } from "./Icon";

interface OnboardingScreensProps {
  onCompleteOnboarding: () => void;
}

export const OnboardingScreens: React.FC<OnboardingScreensProps> = ({
  onCompleteOnboarding,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans text-white select-none overflow-y-auto flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Ambient Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-2xl" />
      </div>

      {/* TOP HEADER & STEP INDICATOR */}
      <div className="relative z-10 w-full max-w-xl flex items-center justify-between pt-2 sm:pt-4 animate-enter-down">
        {/* 4 Step dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <span
              key={stepNum}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentStep === stepNum ? "w-8 bg-emerald-400" : "w-2.5 bg-slate-700"
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1 rounded-full shadow-md">
          Paso {currentStep} de 4
        </span>
      </div>

      {/* SCREEN 1: ¿DÓNDE SE USA REMOTION 4.0? */}
      {currentStep === 1 && (
        <div className="relative z-10 w-full max-w-xl my-auto flex flex-col items-center text-center animate-enter-scale">
          {/* Remotion Player Composition */}
          <div className="w-72 h-44 sm:w-96 sm:h-52 mb-2 pointer-events-none flex items-center justify-center animate-enter-scale">
            <Player
              acknowledgeRemotionLicense
              component={RemotionTechComposition}
              durationInFrames={120}
              compositionWidth={500}
              compositionHeight={300}
              fps={30}
              loop
              autoPlay
              controls={false}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
              }}
            />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-3 animate-enter-up">
            ¿Cómo se usa Remotion 4.0?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg mb-6 sm:mb-8 leading-relaxed animate-enter-up">
            Este proyecto utiliza <span className="text-emerald-400 font-bold">Remotion 4.0</span> para renderizar animaciones programáticas en tiempo real en React.
          </p>

          {/* Remotion Usage Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left animate-enter-up">
            <div className="bg-slate-900/90 border border-emerald-500/40 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="radar" className="w-6 h-6 text-emerald-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-0.5">
                Sonar Radar Sweep
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Efecto de radar de marcación animado cuadro por cuadro en Remotion.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-cyan-500/40 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="clapperboard" className="w-6 h-6 text-cyan-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-0.5">
                Hero Banners
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Insignias e imágenes animadas con física de resorte `spring()`.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/40 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="trophy" className="w-6 h-6 text-amber-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-0.5">
                Celebración +30 XP
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Explosión de confeti y estrellas al finalizar cada llamada.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: ¿CÓMO SE USA LA INTELIGENCIA ARTIFICIAL (IA)? */}
      {currentStep === 2 && (
        <div className="relative z-10 w-full max-w-xl my-auto flex flex-col items-center text-center animate-enter-scale">
          {/* Remotion Player for AI Engine */}
          <div className="w-72 h-44 sm:w-96 sm:h-52 mb-2 pointer-events-none flex items-center justify-center animate-enter-scale">
            <Player
              acknowledgeRemotionLicense
              component={RemotionAIEngineComposition}
              durationInFrames={120}
              compositionWidth={500}
              compositionHeight={300}
              fps={30}
              loop
              autoPlay
              controls={false}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
              }}
            />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-3 animate-enter-up">
            ¿Cómo se usa la IA en este proyecto?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg mb-6 sm:mb-8 leading-relaxed animate-enter-up">
            La respuesta a cada pregunta se procesa mediante el modelo de lenguaje de última generación <span className="text-cyan-400 font-bold">Google Gemini AI</span> (`gemini-3.6-flash`).
          </p>

          {/* AI Feature Explanation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left animate-enter-up">
            <div className="bg-slate-900/90 border border-cyan-500/40 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="brain" className="w-6 h-6 text-cyan-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-0.5">
                Procesamiento Gemini AI
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Genera respuestas concisas, educativas y fascinantes en español e inglés.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-emerald-500/40 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="sparkles" className="w-6 h-6 text-emerald-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-0.5">
                Extracción de Emociones
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                La IA incrusta etiquetas de postura (`{'{feliz}'}`, `{'{triste}'}`, `{'{hablando}'}`) para mover al Elfo.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/40 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="lightning" className="w-6 h-6 text-amber-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-0.5">
                Motor de Respaldo Offline
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Resuelve cálculos matemáticos y datos de ciencia e historia sin depender de red.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: ¿CÓMO FUNCIONA EL PROYECTO? */}
      {currentStep === 3 && (
        <div className="relative z-10 w-full max-w-xl my-auto flex flex-col items-center text-center animate-enter-scale">
          {/* Remotion Animated Hero Player */}
          <div className="w-72 h-44 sm:w-96 sm:h-52 mb-2 pointer-events-none flex items-center justify-center animate-enter-scale">
            <Player
              acknowledgeRemotionLicense
              component={OnboardingBannerComposition}
              durationInFrames={120}
              compositionWidth={500}
              compositionHeight={300}
              fps={30}
              loop
              autoPlay
              controls={false}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
              }}
            />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-3 animate-enter-up">
            ¿Cómo funciona el Elfo AI?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg mb-6 sm:mb-8 leading-relaxed animate-enter-up">
            Una experiencia interactiva estilo <span className="text-emerald-400 font-bold">Duolingo</span> para aprender cultura general, ciencia, historia y matemáticas mediante videollamada con IA.
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left animate-enter-up">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="speak" className="w-6 h-6 text-emerald-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-1">
                Reconocimiento de Voz
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                Ondas de micrófono en tiempo real con Web Audio API para detectar cuando hablas.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="sparkles" className="w-6 h-6 text-cyan-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-1">
                Animación Lottie
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                El Elfo reacciona con gestos y vuelve a neutral cuando termina de hablar.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-transform flex flex-col items-start">
              <Icon name="bulb" className="w-6 h-6 text-amber-400 mb-1.5" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white mb-1">
                Bilingüe & Voz
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                Lectura por voz en español y traducción simultánea al inglés.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 4: INSTRUCCIONES Y BOTÓN PROBAR LLAMAR AL ELFO */}
      {currentStep === 4 && (
        <div className="relative z-10 w-full max-w-xl my-auto flex flex-col items-center text-center animate-enter-scale">
          {/* Interactive Mic / Phone Badge */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-6 shadow-2xl animate-enter-scale">
            <Icon name="microphone" className="w-12 h-12 sm:w-14 sm:h-14" colorClass="bg-emerald-400" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-3 animate-enter-up">
            Guía de Interacción
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg mb-6 sm:mb-8 leading-relaxed animate-enter-up">
            Puedes comunicarte por voz mediante el micrófono o escribiendo directamente en la barra de texto.
          </p>

          {/* Step Guide List */}
          <div className="w-full flex flex-col gap-2.5 text-left mb-2 animate-enter-up">
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl backdrop-blur-md hover:border-emerald-500/50 transition-all">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  Presiona "Hablar IA" o escribe tu pregunta
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Las ondas de voz detectarán cuando estés hablando en tiempo real.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl backdrop-blur-md hover:border-emerald-500/50 transition-all">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  Escucha la respuesta y observa la animación
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  El Elfo responderá con voz clara y adaptará su postura al tema.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BUTTONS */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md pb-6 sm:pb-8 flex flex-col items-center gap-3 animate-enter-up">
        {currentStep < 4 ? (
          <div className="w-full flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-5 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-sm transition-all cursor-pointer"
              >
                ←
              </button>
            )}
            <button
              onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
              className="flex-1 py-4 sm:py-4.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer duo-button-shadow"
            >
              <span>Siguiente</span>
              <Icon name="arrowRight" className="w-5 h-5" colorClass="bg-slate-950" />
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2.5">
            <button
              onClick={onCompleteOnboarding}
              className="w-full py-4 sm:py-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer duo-button-shadow animate-pulse"
            >
              <Icon name="phone" className="w-6 h-6 sm:w-7 sm:h-7" colorClass="bg-slate-950" />
              <span>Probar llamar al elfo</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs font-extrabold text-slate-400 hover:text-white transition-colors py-1 cursor-pointer"
            >
              ← Volver al paso anterior
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
