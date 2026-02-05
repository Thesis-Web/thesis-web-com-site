import { startTerminalTyper, buildGreeting } from "../components/TerminalTyper";
import { terminalNarrative, terminalFullCopyText } from "../content/terminalScript";

function boot() {
  console.log("[terminal] boot");
  const el = document.getElementById("terminal-hero");
  if (!el) return;

  const greeting = buildGreeting();

  const tokens = [
    { type: "line", value: greeting },
    { type: "pause", ms: 450 },
    { type: "line", value: "" },
    ...terminalNarrative,
  ];

  const fullText = [greeting, "", terminalFullCopyText].join("\n");

  startTerminalTyper({
    target: el,
    tokens,
    fullTextForInstantRender: fullText,
    charDelayMs: 13,
    jitterMs: 7,
    lineDelayMs: 85,
    blockGapMs: 200,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
