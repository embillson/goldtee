"use client";
import { useToast } from "@/store/toast";

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className="pointer-events-auto flex items-center gap-3 px-5 py-3 text-sm font-medium shadow-2xl cursor-pointer animate-fade-in"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--gold)",
            color: "var(--white)",
            borderRadius: "2px",
            minWidth: "220px",
            maxWidth: "90vw",
          }}
        >
          <span style={{ color: "var(--gold)" }}>
            {t.type === "success" ? "✓" : "ℹ"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
