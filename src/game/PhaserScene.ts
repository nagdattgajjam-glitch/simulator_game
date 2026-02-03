import Phaser from "phaser";
import { useGameStore } from "../store/gameStore";
import { formatCoins } from "../utils/format";

export class CoffeeScene extends Phaser.Scene {
  private coinText?: Phaser.GameObjects.Text;
  private beans?: Phaser.GameObjects.Arc;

  constructor() {
    super("coffee-scene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#f3ebe2");

    this.beans = this.add.circle(160, 120, 40, 0xa67755);
    this.add.circle(180, 100, 20, 0xc49674);

    this.coinText = this.add
      .text(24, 200, "Coins: 0", {
        fontFamily: "Inter, sans-serif",
        fontSize: "18px",
        color: "#5b3d2a"
      })
      .setShadow(0, 1, "#ffffff", 4);

    this.tweens.add({
      targets: this.beans,
      scale: 1.05,
      yoyo: true,
      repeat: -1,
      duration: 1200
    });
  }

  update() {
    const coins = useGameStore.getState().coins;
    if (this.coinText) {
      this.coinText.setText(`Coins: ${formatCoins(coins)}`);
    }
  }
}
