import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { CoffeeScene } from "./PhaserScene";

export const PhaserGame = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 320,
      height: 240,
      parent: containerRef.current,
      scene: [CoffeeScene],
      physics: { default: "arcade" },
      fps: { target: 60, forceSetTimeOut: true }
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="overflow-hidden rounded-2xl border border-coffee-200" />;
};
