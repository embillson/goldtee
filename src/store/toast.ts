import { create } from "zustand";

type Toast = { id: number; message: string; type: "success" | "info" };

type ToastStore = {
  toasts: Toast[];
  show: (message: string, type?: Toast["type"]) => void;
  dismiss: (id: number) => void;
};

let nextId = 0;

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  show(message, type = "success") {
    const id = ++nextId;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2800);
  },
  dismiss(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));
