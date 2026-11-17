import type { Project } from "@/lib/site";

/** Designed SVG visuals (no external images). */
export default function ProjectVisual({ kind, title }: { kind: Project["visual"]; title: string }) {
  if (kind === "store") {
    return (
      <svg viewBox="0 0 400 300" role="img" aria-label={`Illustration of ${title}`} className="h-full w-full">
        <rect width="400" height="300" fill="#141C3F" />
        <circle cx="330" cy="40" r="120" fill="#FF6B57" opacity="0.22" />
        <circle cx="50" cy="270" r="90" fill="#5B6A9A" opacity="0.25" />
        <g opacity="0.5" stroke="#F5EEE6" strokeOpacity="0.15">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="300" />
          ))}
        </g>
        <rect x="105" y="34" width="190" height="232" rx="20" fill="#0A0F24" stroke="#F5EEE6" strokeOpacity="0.2" />
        <circle cx="200" cy="74" r="20" fill="#FF6B57" />
        <path d="M191 70h18l-2 12h-14z M195 70c0-6 10-6 10 0" fill="none" stroke="#0A0F24" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        <text x="200" y="118" textAnchor="middle" fill="#F5EEE6" fontSize="15" fontWeight="300">
          Faris Store
        </text>
        <rect x="127" y="136" width="146" height="30" rx="9" fill="#141C3F" stroke="#F5EEE6" strokeOpacity="0.18" />
        <rect x="137" y="148" width="54" height="6" rx="3" fill="#5B6A9A" />
        <rect x="127" y="176" width="146" height="30" rx="9" fill="#141C3F" stroke="#F5EEE6" strokeOpacity="0.18" />
        <g fill="#5B6A9A">
          {[137, 148, 159, 170, 181].map((x) => (
            <circle key={x} cx={x} cy="191" r="2.6" />
          ))}
        </g>
        <rect x="127" y="220" width="146" height="30" rx="15" fill="#FF6B57" />
        <rect x="177" y="232" width="46" height="6" rx="3" fill="#0A0F24" />
      </svg>
    );
  }

  const rows = [
    { y: 92, name: 64, done: true, c: "#FF6B57" },
    { y: 132, name: 82, done: true, c: "#FF8A73" },
    { y: 172, name: 56, done: false, c: "#5B6A9A" },
    { y: 212, name: 74, done: true, c: "#F5EEE6" },
  ];
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Illustration of ${title}`} className="h-full w-full">
      <rect width="400" height="300" fill="#141C3F" />
      <circle cx="70" cy="30" r="110" fill="#FF6B57" opacity="0.18" />
      <circle cx="360" cy="280" r="100" fill="#5B6A9A" opacity="0.28" />
      <rect x="60" y="30" width="280" height="240" rx="22" fill="#0A0F24" stroke="#F5EEE6" strokeOpacity="0.2" />
      <text x="82" y="62" fill="#F5EEE6" fontSize="14" fontWeight="300">
        Attendance
      </text>
      <g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} cx={236 + i * 14} cy="57" r="4" fill={i < 5 ? "#FF6B57" : "#5B6A9A"} opacity={i < 5 ? 1 : 0.5} />
        ))}
      </g>
      <line x1="82" y1="74" x2="318" y2="74" stroke="#F5EEE6" strokeOpacity="0.12" />
      {rows.map((r) => (
        <g key={r.y}>
          <circle cx="96" cy={r.y} r="12" fill={r.c} opacity="0.9" />
          <rect x="120" y={r.y - 9} width={r.name} height="7" rx="3.5" fill="#F5EEE6" opacity="0.85" />
          <rect x="120" y={r.y + 3} width="40" height="5" rx="2.5" fill="#5B6A9A" />
          {r.done ? (
            <g>
              <circle cx="304" cy={r.y} r="11" fill="#FF6B57" />
              <path d={`M298 ${r.y} l4 4 l8 -8`} fill="none" stroke="#0A0F24" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : (
            <circle cx="304" cy={r.y} r="10" fill="none" stroke="#5B6A9A" strokeWidth="2" strokeDasharray="3 3" />
          )}
        </g>
      ))}
    </svg>
  );
}
