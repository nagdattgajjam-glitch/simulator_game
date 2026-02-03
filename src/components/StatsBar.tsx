import { calculateAutoRate, isBoostActive, useGameStore } from "../store/gameStore";
import { formatCoins } from "../utils/format";

export const StatsBar = () => {
  const coins = useGameStore((state) => state.coins);
  const upgrades = useGameStore((state) => state.upgrades);
  const boostActiveUntil = useGameStore((state) => state.boostActiveUntil);
  const boostMultiplier = useGameStore((state) => state.boostMultiplier);

  const autoRate = calculateAutoRate(upgrades);
  const boostActive = isBoostActive(boostActiveUntil);

  const remainingSeconds = boostActiveUntil
    ? Math.max(0, Math.floor((boostActiveUntil - Date.now()) / 1000))
    : 0;

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-coffee-500">Coins</p>
          <p className="text-3xl font-semibold">{formatCoins(coins)}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-coffee-500">Auto Rate</p>
          <p className="text-xl font-semibold">{formatCoins(autoRate)} / sec</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-coffee-500">Boost</p>
          <p className="text-xl font-semibold">
            {boostActive ? `${boostMultiplier}x (${remainingSeconds}s)` : "None"}
          </p>
        </div>
      </div>
    </div>
  );
};
