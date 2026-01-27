import { create } from "zustand";

type DimensionState = {
  width: number;
  height: number;
  setSize: (width: number, height: number) => void;
};

export const useDimensionStore = create<DimensionState>((set) => ({
  width: 0,
  height: 0,
  setSize: (width, height) => set({ width, height }),
}));
