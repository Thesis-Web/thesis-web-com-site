export type TerminalLine = {
  text: string;
  delayMs?: number;
};

type Options = {
  target: HTMLElement;
  lines: TerminalLine[];
  charDelayMs?: number;
  jitterMs?: number;
  cursorSelector?: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function motionAllowed() {
  return !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

export async function runTerminalTyper(opts: Options) {
  const { target, lines, charDelayMs = 18, jitterMs = 22, cursorSelector } = opts;

  if (!motionAllowed()) {
    // Render full content immediately.
    const full = lines.map((l) => l.text).join("\n");
    target.textContent = full;
    const cursor = cursorSelector ? document.querySelector(cursorSelector) : null;
    if (cursor instanceof HTMLElement) cursor.style.display = "none";
    return;
  }

  target.textContent = "";
  for (const line of lines) {
    // Type each line
    for (let i = 0; i < line.text.length; i++) {
      target.textContent += line.text[i];
      const jitter = Math.floor(Math.random() * jitterMs);
      await sleep(charDelayMs + jitter);
    }
    target.textContent += "\n";
    if (line.delayMs) await sleep(line.delayMs);
  }
}
