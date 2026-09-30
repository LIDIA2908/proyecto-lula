import "./index.css";
import { Composition } from "remotion";
import { DuolingoVideoCall } from "./components/DuolingoVideoCall";
import { HelloWorld } from "./HelloWorld";
import { LottieAnimation } from "./LottieAnimation";
import { SonarRadarComposition } from "./remotion/SonarRadarComposition";
import { OnboardingBannerComposition } from "./remotion/OnboardingBannerComposition";
import { CelebrationXPComposition } from "./remotion/CelebrationXPComposition";
import { RemotionTechComposition } from "./remotion/RemotionTechComposition";
import { RemotionAIEngineComposition } from "./remotion/RemotionAIEngineComposition";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RemotionAIEngine"
        component={RemotionAIEngineComposition}
        durationInFrames={120}
        fps={30}
        width={500}
        height={300}
      />
      <Composition
        id="RemotionTech"
        component={RemotionTechComposition}
        durationInFrames={120}
        fps={30}
        width={500}
        height={300}
      />
      <Composition
        id="SonarRadar"
        component={SonarRadarComposition}
        durationInFrames={120}
        fps={30}
        width={400}
        height={400}
      />

      <Composition
        id="OnboardingBanner"
        component={OnboardingBannerComposition}
        durationInFrames={120}
        fps={30}
        width={500}
        height={300}
      />

      <Composition
        id="CelebrationXP"
        component={CelebrationXPComposition}
        durationInFrames={90}
        fps={30}
        width={400}
        height={300}
      />

      <Composition
        id="DuolingoVideoCall"
        component={DuolingoVideoCall}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="DuolingoVideoCallDesktop"
        component={DuolingoVideoCall}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="LottieAnimation"
        component={LottieAnimation}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />
    </>
  );
};


