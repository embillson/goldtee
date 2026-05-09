"use client";
import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "5rem",
        right: "1.5rem",
        width: "42px",
        height: "42px",
        background: "var(--surface)",
        border: "1px solid var(--gold)",
        color: "var(--gold)",
        fontSize: "18px",
        cursor: "pointer",
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s, color 0.2s",
        borderRadius: "2px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--dark)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--surface)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--gold)";
      }}
    >
      ↑
    </button>
  );
}
