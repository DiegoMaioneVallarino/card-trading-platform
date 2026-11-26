import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GradingCompany = "PSA" | "BGS" | "CGC" | "TAG";

export interface GradedCardRecord {
  id: string;
  itemId?: string;
  name: string;
  collection: string;
  company: GradingCompany;
  grade: string;
  certNumber: string;
  estimatedValue: number;
  image: string;
  notes: string;
  addedAt: string;
}

interface GradingState {
  records: GradedCardRecord[];
  addRecord: (record: Omit<GradedCardRecord, "id" | "addedAt">) => void;
  removeRecord: (id: string) => void;
}

const seed: GradedCardRecord[] = [
  {
    id: "grade-demo-1",
    name: "Charizard",
    collection: "Base Set",
    company: "PSA",
    grade: "9",
    certNumber: "PSA-004-1999-9",
    estimatedValue: 18200,
    image: "/images/charizard.png",
    notes: "Centered well with minor edge wear.",
    addedAt: "2026-11-02T15:00:00.000Z",
  },
];

export const useGradingStore = create<GradingState>()(
  persist(
    (set) => ({
      records: seed,
      addRecord: (record) =>
        set((state) => ({
          records: [
            {
              ...record,
              id: crypto.randomUUID(),
              addedAt: new Date().toISOString(),
            },
            ...state.records,
          ],
        })),
      removeRecord: (id) =>
        set((state) => ({ records: state.records.filter((record) => record.id !== id) })),
    }),
    { name: "card-market-grading" },
  ),
);
