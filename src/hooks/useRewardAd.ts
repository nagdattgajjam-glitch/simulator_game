import { useState } from "react";
import { useGameStore } from "../store/gameStore";

const AD_LOAD_TIME_MS = 2000;
const AD_REWARD_COINS = 45;

export const useRewardAd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const startBoost = useGameStore((state) => state.startBoost);
  const grantInstantCoins = useGameStore((state) => state.grantInstantCoins);
  const pushToast = useGameStore((state) => state.pushToast);

  const watchAd = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, AD_LOAD_TIME_MS));

    const rewardType = Math.random() > 0.5 ? "boost" : "coins";
    if (rewardType === "boost") {
      startBoost(60, 2);
    } else {
      grantInstantCoins(AD_REWARD_COINS);
      pushToast({ type: "success", message: `Ad reward: +${AD_REWARD_COINS} coins!` });
    }

    setIsLoading(false);
  };

  return { watchAd, isLoading };
};
