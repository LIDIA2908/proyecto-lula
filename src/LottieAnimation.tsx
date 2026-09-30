import { Lottie, LottieAnimationData } from "@remotion/lottie";
import sampleLottie from "./sample-lottie.json";


export const LottieAnimation: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-950 flex flex-col justify-center items-center text-white font-sans w-full h-full">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
        Remotion + Lottie + Tailwind CSS
      </h1>
      <div className="p-8 rounded-2xl bg-slate-900/80 shadow-2xl border border-slate-800 backdrop-blur-sm">
        <Lottie
          animationData={sampleLottie as unknown as LottieAnimationData}
          style={{ width: 400, height: 400 }}
        />
      </div>
    </div>
  );
};

