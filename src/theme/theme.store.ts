import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "system" | "light" | "dark";

interface ThemeState {
  preference: ThemePreference;
  hydrated: boolean;
  setPreference: (preference: ThemePreference) => void;
}

/** The user's Light / Dark / System choice, remembered across launches (web: ThemeToggle + localStorage). */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      hydrated: false,
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: "oja-theme",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preference: state.preference }),
      onRehydrateStorage: () => () => useThemeStore.setState({ hydrated: true }),
    },
  ),
);
