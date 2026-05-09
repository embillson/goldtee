import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  slug: string;
};

type WishlistStore = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle(item) {
        const exists = get().items.some((i) => i.id === item.id);
        set({
          items: exists
            ? get().items.filter((i) => i.id !== item.id)
            : [...get().items, item],
        });
      },
      has(id) {
        return get().items.some((i) => i.id === id);
      },
      remove(id) {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
    }),
    { name: "goldtee-wishlist" }
  )
);
