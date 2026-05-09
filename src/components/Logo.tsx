type Props = {
  className?: string;
  size?: number;
};

export default function Logo({ className = "", size = 40 }: Props) {
  return (
    <svg
      width={size * 3.6}
      height={size}
      viewBox="0 0 144 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GoldTee"
    >
      {/* Tee shaft */}
      <rect x="18" y="16" width="3" height="18" rx="1.5" fill="#c8a84b" />

      {/* Tee head (top bar) */}
      <rect x="10" y="12" width="19" height="5" rx="2.5" fill="#c8a84b" />

      {/* Golf ball */}
      <circle cx="19.5" cy="8" r="5.5" fill="#f4f0e6" />

      {/* Ball dimple lines — subtle */}
      <path
        d="M15 6.5 Q19.5 4.5 24 6.5"
        stroke="#d0ccc0"
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14.5 9 Q19.5 11 24.5 9"
        stroke="#d0ccc0"
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
      />

      {/* Wordmark — "Gold" */}
      <text
        x="38"
        y="27"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="20"
        fill="#c8a84b"
        letterSpacing="-0.5"
      >
        Gold
      </text>

      {/* Wordmark — "Tee" (slightly lighter weight) */}
      <text
        x="88"
        y="27"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="400"
        fontSize="20"
        fill="#f4f0e6"
        letterSpacing="-0.5"
      >
        Tee
      </text>

      {/* Thin gold underline accent */}
      <rect x="38" y="31" width="106" height="1.5" rx="0.75" fill="#c8a84b" opacity="0.5" />
    </svg>
  );
}
