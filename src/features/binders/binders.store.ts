import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BinderTheme = "classic" | "midnight" | "ruby" | "emerald";

export interface BinderPage {
  id: string;
  title: string;
  slots: (string | null)[];
}

export interface DigitalBinder {
  id: string;
  name: string;
  description: string;
  theme: BinderTheme;
  createdAt: string;
  pages: BinderPage[];
}

interface BinderState {
  binders: DigitalBinder[];
  createBinder: (payload: Pick<DigitalBinder, "name" | "description" | "theme">) => string;
  removeBinder: (id: string) => void;
  renameBinder: (id: string, changes: Partial<Pick<DigitalBinder, "name" | "description" | "theme">>) => void;
  addPage: (binderId: string, title?: string) => void;
  updatePageTitle: (binderId: string, pageId: string, title: string) => void;
  assignSlot: (binderId: string, pageId: string, slotIndex: number, itemId: string | null) => void;
}

const seed: DigitalBinder[] = [
  {
    id: "demo-binder-1",
    name: "Kanto Highlights",
    description: "A curated binder for the most iconic cards in my Pokémon showcase.",
    theme: "classic",
    createdAt: "2026-11-01T10:00:00.000Z",
    pages: [
      {
        id: "demo-page-1",
        title: "Front Page",
        slots: Array.from({ length: 9 }, (_, index) => (index === 0 ? null : null)),
      },
    ],
  },
];

export const useBinderStore = create<BinderState>()(
  persist(
    (set) => ({
      binders: seed,
      createBinder: (payload) => {
        const id = crypto.randomUUID();
        set((state) => ({
          binders: [
            {
              id,
              createdAt: new Date().toISOString(),
              pages: [
                {
                  id: crypto.randomUUID(),
                  title: "Page 1",
                  slots: Array.from({ length: 9 }, () => null),
                },
              ],
              ...payload,
            },
            ...state.binders,
          ],
        }));
        return id;
      },
      removeBinder: (id) =>
        set((state) => ({ binders: state.binders.filter((binder) => binder.id !== id) })),
      renameBinder: (id, changes) =>
        set((state) => ({
          binders: state.binders.map((binder) => (binder.id === id ? { ...binder, ...changes } : binder)),
        })),
      addPage: (binderId, title) =>
        set((state) => ({
          binders: state.binders.map((binder) =>
            binder.id === binderId
              ? {
                  ...binder,
                  pages: [
                    ...binder.pages,
                    {
                      id: crypto.randomUUID(),
                      title: title ?? `Page ${binder.pages.length + 1}`,
                      slots: Array.from({ length: 9 }, () => null),
                    },
                  ],
                }
              : binder,
          ),
        })),
      updatePageTitle: (binderId, pageId, title) =>
        set((state) => ({
          binders: state.binders.map((binder) =>
            binder.id === binderId
              ? {
                  ...binder,
                  pages: binder.pages.map((page) => (page.id === pageId ? { ...page, title } : page)),
                }
              : binder,
          ),
        })),
      assignSlot: (binderId, pageId, slotIndex, itemId) =>
        set((state) => ({
          binders: state.binders.map((binder) =>
            binder.id === binderId
              ? {
                  ...binder,
                  pages: binder.pages.map((page) =>
                    page.id === pageId
                      ? {
                          ...page,
                          slots: page.slots.map((slot, index) => (index === slotIndex ? itemId : slot)),
                        }
                      : page,
                  ),
                }
              : binder,
          ),
        })),
    }),
    { name: "card-market-binders" },
  ),
);
