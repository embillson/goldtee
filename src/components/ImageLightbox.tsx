"use client";
import { useEffect } from "react";

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function ImageLightbox({ src, alt, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.92)",
          zIndex: 200,
          cursor: "zoom-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <img
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
            border: "1px solid var(--border)",
            cursor: "default",
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: "fixed",
            top: "1.25rem",
            right: "1.25rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--dim)",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "2px",
          }}
        >
          ✕
        </button>
      </div>
    </>
  );
}
