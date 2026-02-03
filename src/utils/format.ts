export const formatCoins = (value: number) => {
  if (value < 1000) {
    return value.toFixed(1);
  }
  if (value < 1_000_000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return `${(value / 1_000_000).toFixed(1)}M`;
};
