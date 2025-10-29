"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

interface LottieIconProps {
  animationData: unknown;
  className?: string;
}

export function LottieIcon({ animationData, className }: LottieIconProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldStopRef = useRef(false);

  useEffect(() => {
    if (isHovered && lottieRef.current) {
      // Reset stop flag and play animation from start on hover
      shouldStopRef.current = false;
      lottieRef.current.setSpeed(1);
      lottieRef.current.play();
    } else if (!isHovered && lottieRef.current) {
      // Set flag to stop after current loop completes
      shouldStopRef.current = true;
    }
  }, [isHovered]);

  const handleLoopComplete = () => {
    // Stop animation only if we're no longer hovered and loop completed
    if (shouldStopRef.current && lottieRef.current) {
      lottieRef.current.stop();
      shouldStopRef.current = false;
    }
  };

  return (
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}
        autoplay={false}
        onLoopComplete={handleLoopComplete}
      />
    </div>
  );
}

