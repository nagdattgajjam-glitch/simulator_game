import { calculateUpgradeCost, useGameStore } from "../store/gameStore";
import { upgradeDefinitions } from "../store/upgradeData";
import { formatCoins } from "../utils/format";

export const ShopPanel = () => {
  const coins = useGameStore((state) => state.coins);
  const upgrades = useGameStore((state) => state.upgrades);
  const purchaseUpgrade = useGameStore((state) => state.purchaseUpgrade);

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white/90 p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Upgrade Shop</h2>
      <div className="mt-4 space-y-3">
        {upgradeDefinitions.map((upgrade) => {
          const owned = upgrades.find((item) => item.id === upgrade.id);
          const level = owned?.level ?? 0;
          const cost = calculateUpgradeCost(upgrade.id, level);
          const canAfford = coins >= cost;
          return (
            <button
              key={upgrade.id}
              type="button"
              onClick={() => purchaseUpgrade(upgrade.id)}
              className="w-full rounded-xl border border-coffee-200 bg-coffee-50 p-3 text-left transition hover:border-coffee-300 hover:bg-white"
              disabled={!canAfford}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{upgrade.name}</p>
                  <p className="text-sm text-coffee-500">{upgrade.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-coffee-500">Level {level}</p>
                  <p className="font-semibold">{formatCoins(cost)} coins</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
