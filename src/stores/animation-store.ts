import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnimationSettings {
  dotGridEnabled: boolean;
  reducedMotion: boolean;
}

interface AnimationStore extends AnimationSettings {
  setDotGridEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  reset: () => void;
}

const defaultSettings: AnimationSettings = {
  dotGridEnabled: true,
  reducedMotion: false,
};

/**
 * Animation settings store
 * Manages user preferences for animations and effects
 */
export const useAnimationStore = create<AnimationStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setDotGridEnabled: (enabled) => set({ dotGridEnabled: enabled }),

      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),

      reset: () => set(defaultSettings),
    }),
    {
      name: "resumier-animation-settings",
    }
  )
);
