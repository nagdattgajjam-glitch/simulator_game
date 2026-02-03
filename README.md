# Idle Coffee Shop Simulator

Minimalistic browser-based idle game built with **React + Vite**, **Phaser**, **Zustand**, and **Tailwind CSS**.

## Setup

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Game Loop Architecture

- **React UI** handles player input and upgrade management.
- **Zustand store** is the source of truth for coins, upgrades, boosts, and timestamps.
- **Simulation loop** (`requestAnimationFrame`) ticks every frame to add passive income.
- **Three.js** renders the primary 3D coffee simulator scene with clickable interactions.
- **Phaser** renders a lightweight secondary scene separate from UI state.
- **Persistence** saves to `localStorage` and restores on load.
- **Offline earnings** are computed using last login timestamp and capped for balance.

## Monetization Integration (Rewarded Ads)

The `useRewardAd` hook simulates ad loading and completion. Replace the mocked timer with real SDK callbacks (e.g. AdSense, Unity Ads):

1. Trigger SDK load.
2. On completion, call `startBoost` or `grantInstantCoins` from the store.
3. Track cooldowns or frequency caps in the store for production readiness.

## Folder Structure

```
src/
  components/  # UI building blocks
  engine/      # Simulation loop
  game/        # Phaser rendering
  hooks/       # Gameplay hooks (rewarded ads, etc.)
  services/    # Local persistence
  store/       # Zustand state
  utils/       # Formatting helpers
```

## Optional 3D Scene

Three.js scene is the primary simulator view with a clickable cup for manual brewing. It is isolated so the game remains playable without 3D rendering.
