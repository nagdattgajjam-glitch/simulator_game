import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";

export const useSimulationLoop = () => {
  const tick = useGameStore((state) => state.tick);
  const lastTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSeconds = (time - lastTimeRef.current) / 1000;
        tick(deltaSeconds);
      }
      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(frame);
    };

    animationFrameRef.current = requestAnimationFrame(frame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tick]);
};
