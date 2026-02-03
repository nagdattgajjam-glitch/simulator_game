export type UpgradeDefinition = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  rateIncrease: number;
};

export const upgradeDefinitions: UpgradeDefinition[] = [
  {
    id: "grinder",
    name: "Coffee Grinder",
    description: "Fresh grinds boost base automation.",
    baseCost: 25,
    rateIncrease: 0.4
  },
  {
    id: "auto-brewer",
    name: "Auto Brewer",
    description: "Brews coffee every few seconds.",
    baseCost: 120,
    rateIncrease: 1.2
  },
  {
    id: "barista-bot",
    name: "Barista Bot",
    description: "Robotic barista keeps cups flowing.",
    baseCost: 450,
    rateIncrease: 3.5
  }
];
