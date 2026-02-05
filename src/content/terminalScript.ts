// src/content/terminalScript.ts
export type TerminalToken =
  | { type: "line"; value: string }
  | { type: "text"; value: string }
  | { type: "pause"; ms: number }
  | { type: "block"; lines: string[]; pauseAfterMs?: number };

// Keep copy tight + readable. No thesisweb.org mention.
export const terminalNarrative: TerminalToken[] = [
  { type: "line", value: "Secure channel: open." },
  { type: "pause", ms: 250 },
  { type: "line", value: "Routing message…" },
  { type: "pause", ms: 350 },

  {
    type: "block",
    lines: [
      "Money is supposed to be a neutral measuring tool.",
      "In practice, it drifts—policy, incentives, and leverage shape it over time.",
    ],
    pauseAfterMs: 600,
  },

  {
    type: "block",
    lines: [
      "That drift shows up as instability:",
      "• purchasing power moves",
      "• pricing signals distort",
      "• long-term planning gets harder than it should be",
    ],
    pauseAfterMs: 700,
  },

  {
    type: "block",
    lines: [
      "THE is an attempt to design a medium of exchange anchored to measurable reality.",
      "Not vibes. Not narratives. Measurables.",
    ],
    pauseAfterMs: 900,
  },

  {
    type: "block",
    lines: [
      "This site is the public build log:",
      "what we think the problem is, what we’re testing, what fails, and what survives.",
    ],
    pauseAfterMs: 700,
  },

  { type: "pause", ms: 350 },
  {
    type: "block",
    lines: [
      "If you want updates, join the list.",
      "If you want to support the work, use the button below.",
    ],
    pauseAfterMs: 0,
  },

  { type: "pause", ms: 250 },
  { type: "line", value: "End of transmission." },
];

export const terminalFullCopyText = [
  "Secure channel: open.",
  "Routing message…",
  "",
  "Money is supposed to be a neutral measuring tool.",
  "In practice, it drifts—policy, incentives, and leverage shape it over time.",
  "",
  "That drift shows up as instability:",
  "• purchasing power moves",
  "• pricing signals distort",
  "• long-term planning gets harder than it should be",
  "",
  "THE is an attempt to design a medium of exchange anchored to measurable reality.",
  "Not vibes. Not narratives. Measurables.",
  "",
  "This site is the public build log:",
  "what we think the problem is, what we’re testing, what fails, and what survives.",
  "",
  "If you want updates, join the list.",
  "If you want to support the work, use the button below.",
  "",
  "End of transmission.",
].join("\n");
