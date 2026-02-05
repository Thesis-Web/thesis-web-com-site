// src/components/TerminalTyper.ts
import type { TerminalToken } from "../content/terminalScript";

export type TerminalTyperOptions = {
  target: HTMLElement;
  tokens: TerminalToken[];
  fullTextForInstantRender: string;

  // pacing
  charDelayMs?: number; // per character
  jitterMs?: number; // small random +/- jitter
  lineDelayMs?: number; // delay after each line
  blockGapMs?: number; // extra gap between blocks
};

type Cleanup = () => void;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

function getRandomJitter(jitterMs: number): number {
  if (jitterMs <= 0) return 0;
  // uniform jitter in [-jitterMs, +jitterMs]
  return Math.floor((Math.random() * 2 - 1) * jitterMs);
}

function safeClampDelay(ms: number): number {
  // avoid negative or silly values
  if (!Number.isFinite(ms)) return 0;
  return Math.max(0, Math.min(10_000, ms));
}

export function buildGreeting(): string {
  // "safe": no unique fingerprinting, only broad categories
  const ua = navigator.userAgent || "";
  const lang = (navigator.language || "en").slice(0, 10);

  const browser =
    ua.includes("Edg/") ? "Edge" :
    ua.includes("Chrome/") && !ua.includes("Edg/") ? "Chrome" :
    ua.includes("Firefox/") ? "Firefox" :
    ua.includes("Safari/") && !ua.includes("Chrome/") ? "Safari" :
    "Browser";

  const h = new Date().getHours();
  const tod = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";

  return `Good ${tod}. Detected: ${browser}. Language: ${lang}.`;
}

export function startTerminalTyper(opts: TerminalTyperOptions): { skip: () => void; cleanup: Cleanup } {
  const {
    target,
    tokens,
    fullTextForInstantRender,
    charDelayMs = 14,
    jitterMs = 6,
    lineDelayMs = 90,
    blockGapMs = 220,
  } = opts;

  let skipped = false;
  let destroyed = false;

  const renderInstant = () => {
    target.textContent = fullTextForInstantRender;
  };

  const skip = () => {
    if (skipped) return;
    skipped = true;
    renderInstant();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") skip();
  };

  const onClick = () => skip();

  document.addEventListener("keydown", onKeyDown, { passive: true });
  target.addEventListener("click", onClick, { passive: true });

  const cleanup: Cleanup = () => {
    if (destroyed) return;
    destroyed = true;
    document.removeEventListener("keydown", onKeyDown);
    target.removeEventListener("click", onClick);
  };

  // Reduced-motion: instant and exit.
  if (prefersReducedMotion()) {
    renderInstant();
    return { skip, cleanup };
  }

  (async () => {
    // Keep textContent-only to avoid injection surfaces.
    target.textContent = "";

    const typeChars = async (s: string) => {
      for (let i = 0; i < s.length; i++) {
        if (skipped || destroyed) return;
        target.textContent += s[i];
        const delay = safeClampDelay(charDelayMs + getRandomJitter(jitterMs));
        if (delay) await sleep(delay);
      }
    };

    const newline = async () => {
      if (skipped || destroyed) return;
      target.textContent += "\n";
      const delay = safeClampDelay(lineDelayMs + getRandomJitter(jitterMs));
      if (delay) await sleep(delay);
    };

    for (const t of tokens) {
      if (skipped || destroyed) return;

      if (t.type === "pause") {
        await sleep(safeClampDelay(t.ms));
        continue;
      }

      if (t.type === "text") {
        await typeChars(t.value);
        continue;
      }

      if (t.type === "line") {
        await typeChars(t.value);
        await newline();
        continue;
      }

      if (t.type === "block") {
        for (const line of t.lines) {
          if (skipped || destroyed) return;
          await typeChars(line);
          await newline();
        }
        // extra whitespace line between blocks
        if (!skipped && !destroyed) {
          target.textContent += "\n";
          await sleep(safeClampDelay(blockGapMs));
        }
        if (t.pauseAfterMs) await sleep(safeClampDelay(t.pauseAfterMs));
        continue;
      }
    }
  })().catch(() => {
    // Fail-safe: never leave empty screen
    renderInstant();
  });

  return { skip, cleanup };
}
