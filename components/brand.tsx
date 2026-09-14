export function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <svg
        width="38"
        height="38"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="9" fill="#155bea" />
        <path
          d="M14 10 11 30M23 10 20 30M8 16h19M7 24h15"
          stroke="white"
          strokeWidth="3"
        />
        <path
          d="m27 22 5 5-5 5"
          stroke="#a9d5ff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        HASHTURN<span className="brand-dot">.</span>
      </span>
    </span>
  );
}
