import React from "react";
import { Composition } from "remotion";
import { SonarRadarComposition } from "./SonarRadarComposition";
import { OnboardingBannerComposition } from "./OnboardingBannerComposition";
import { CelebrationXPComposition } from "./CelebrationXPComposition";
import { RemotionAIEngineComposition } from "./RemotionAIEngineComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
        id="RemotionAIEngine"
        component={RemotionAIEngineComposition}
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
    </>
  );
};
