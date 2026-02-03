import { useEffect, useState } from "react";
import { ShopPanel } from "./components/ShopPanel";
import { StatsBar } from "./components/StatsBar";
import { Toasts } from "./components/Toast";
import { RewardAdButton } from "./components/RewardAdButton";
import { PhaserGame } from "./game/PhaserGame";
import { ThreeScene } from "./components/ThreeScene";
import { useSimulationLoop } from "./engine/simulation";
import { loadState, saveState } from "./services/persistence";
import { useGameStore } from "./store/gameStore";
import { formatCoins } from "./utils/format";

export default function App() {
  const clickCoffee = useGameStore((state) => state.clickCoffee);
  const coinsPerClick = useGameStore((state) => state.coinsPerClick);
  const applyOfflineEarnings = useGameStore((state) => state.applyOfflineEarnings);
  const hydrate = useGameStore((state) => state.hydrate);
  const setLastLogin = useGameStore((state) => state.setLastLogin);
  const [showThree, setShowThree] = useState(false);

  useSimulationLoop();

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      hydrate(saved);
      const offlineSeconds = (Date.now() - saved.lastLogin) / 1000;
      applyOfflineEarnings(offlineSeconds);
    }
    setLastLogin(Date.now());
  }, [applyOfflineEarnings, hydrate, setLastLogin]);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state) => {
      saveState({
        coins: state.coins,
        coinsPerClick: state.coinsPerClick,
        upgrades: state.upgrades,
        boostMultiplier: state.boostMultiplier,
        boostActiveUntil: state.boostActiveUntil,
        lastLogin: state.lastLogin
      });
    });

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        setLastLogin(Date.now());
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleVisibility);

    return () => {
      unsubscribe();
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleVisibility);
    };
  }, [setLastLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100 px-6 py-8">
      <Toasts />
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Idle Coffee Shop Simulator</h1>
            <p className="text-sm text-coffee-600">
              Brew coffee, automate production, and expand your café.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RewardAdButton />
            <button
              type="button"
              onClick={() => setShowThree((prev) => !prev)}
              className="rounded-xl border border-coffee-200 bg-white px-4 py-3 text-sm font-semibold text-coffee-700 shadow-sm"
            >
              {showThree ? "Hide 3D Scene" : "Show 3D Scene"}
            </button>
          </div>
        </header>

        <StatsBar />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-coffee-200 bg-white/90 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-wide text-coffee-500">Manual Brew</p>
              <h2 className="mt-2 text-2xl font-semibold">Make Coffee</h2>
              <p className="text-sm text-coffee-600">
                Click to earn {formatCoins(coinsPerClick)} coins per cup.
              </p>
              <button
                type="button"
                onClick={clickCoffee}
                className="mt-4 w-full rounded-2xl bg-coffee-700 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-coffee-800"
              >
                Brew Coffee ☕
              </button>
            </div>
            <div className="rounded-2xl border border-coffee-200 bg-white/90 p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Cafe Visuals</h2>
              <p className="text-sm text-coffee-600">
                Phaser renders the shop while the UI handles upgrades and progression.
              </p>
              <div className="mt-3">
                <PhaserGame />
              </div>
            </div>
            {showThree && (
              <div className="rounded-2xl border border-coffee-200 bg-white/90 p-4 shadow-sm">
                <h2 className="text-lg font-semibold">Optional 3D Scene</h2>
                <p className="text-sm text-coffee-600">
                  Minimal Three.js scene ready for future expansion.
                </p>
                <div className="mt-3 flex justify-center">
                  <ThreeScene />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <ShopPanel />
            <div className="rounded-2xl border border-coffee-200 bg-white/90 p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Progression Tips</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-coffee-600">
                <li>Invest in auto brewers to build passive income.</li>
                <li>Use rewarded ads for short bursts of production.</li>
                <li>Offline earnings are capped at 8 hours.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
