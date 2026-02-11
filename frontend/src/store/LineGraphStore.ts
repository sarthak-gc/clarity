import type { LineGraphPoint } from "@/types/all";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LineGraphState {
  lineGraphData: LineGraphPoint[];
  setLineGraphData: (lineGraphData: LineGraphPoint[]) => void;
}

export const useLineGraphStore = create<LineGraphState>()(
  persist(
    (set) => ({
      lineGraphData: [] as LineGraphPoint[],
      setLineGraphData: (lineGraphData) => set({ lineGraphData }),
    }),
    {
      name: "line-graph-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
