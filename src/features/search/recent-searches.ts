import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecentSearches {
  terms: string[];
  add: (term: string) => void;
  clear: () => void;
}

/** The last few things the shopper searched for, kept on the phone. */
export const useRecentSearches = create<RecentSearches>()(
  persist(
    (set, get) => ({
      terms: [],
      add: (term) => {
        const t = term.trim();
        if (t.length < 2) return;
        set({ terms: [t, ...get().terms.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 6) });
      },
      clear: () => set({ terms: [] }),
    }),
    { name: "oja-recent-searches", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
