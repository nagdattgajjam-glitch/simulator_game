import { useRewardAd } from "../hooks/useRewardAd";

export const RewardAdButton = () => {
  const { watchAd, isLoading } = useRewardAd();

  return (
    <button
      type="button"
      onClick={watchAd}
      disabled={isLoading}
      className="rounded-xl border border-coffee-200 bg-coffee-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-coffee-800"
    >
      {isLoading ? "Loading ad..." : "Watch Rewarded Ad"}
    </button>
  );
};
