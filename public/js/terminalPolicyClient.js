// public/js/terminalPolicyClient.js
(() => {
  const prefersReducedMotion = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const buildGreeting = () => {
    const ua = navigator.userAgent || "";
    const langFull = (navigator.language || "en-US").slice(0, 10);
    const lang = langFull.toLowerCase();

    const browser =
      ua.includes("Edg/") ? "Edge" :
      ua.includes("Chrome/") && !ua.includes("Edg/") ? "Chrome" :
      ua.includes("Firefox/") ? "Firefox" :
      ua.includes("Safari/") && !ua.includes("Chrome/") ? "Safari" :
      "Browser";

    const h = new Date().getHours();
    const tod = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";

    return `${tod === "morning" ? "Good morning" : tod === "afternoon" ? "Good afternoon" : "Good evening"}. ` +
           `Welcome (${browser}) user. Language: ${langFull}.`;
  };

  const narrativeLines = [
    "DONATION POLICY CHANNEL — OPEN",
    "",
    "IMPORTANT. MUST READ. EYES ONLY.",
    "",
    "This project accepts voluntary donations only.",
    "Donations are used to directly support:",
    "• ongoing development",
    "• infrastructure and hosting",
    "• documentation and research",
    "• the developers themselves",
    "",
    "This includes the primary developer maintaining the system.",
    "Sustaining human contributors is required to sustain the work.",
    "",
    "We do NOT accept:",
    "• corporate quid-pro-quo",
    "• government funding",
    "• influence payments",
    "• policy leverage of any kind",
    "",
    "No donation grants control, priority access, or special treatment.",
    "No returns, equity, profit share, or resale rights are offered.",
    "",
    "This is not an investment vehicle.",
    "This is an independent research and development effort.",
    "",
    "The system is being designed for people.",
    "Not for states. Not for corporations. Not for gatekeepers.",
    "",
    "Factory workers. Professionals. Parents. Retirees.",
    "Anyone willing to participate on equal footing.",
    "",
    "We will defend these principles explicitly and publicly.",
    "",
    "Transparency is intentional. There is no sleight of hand.",
    "",
    "If you choose to support this work, thank you.",
    "If not, the work continues anyway.",
    "",
    "End of policy transmission."
  ];

  const fullText = () => [buildGreeting(), "", ...narrativeLines].join("\n");

  async function typeAll(el) {
    const charDelayMs = 24;
    const jitterMs = 10;
    const lineDelayMs = 220;
    const blockGapMs = 550;
    const longPauseMs = 1000;

    const longPauseAfter = new Set([
      "IMPORTANT. MUST READ. EYES ONLY.",
      "We do NOT accept:",
      "This is not an investment vehicle.",
      "The system is being designed for people.",
      "End of policy transmission.",
    ]);

    let skipped = false;
    const skip = () => {
      if (skipped) return;
      skipped = true;
      el.textContent = fullText();
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") skip();
    }, { passive: true });

    el.addEventListener("click", skip, { passive: true });

    if (prefersReducedMotion()) {
      skip();
      return;
    }

    el.textContent = "";
    const jitter = () => Math.floor((Math.random() * 2 - 1) * jitterMs);

    const typeLine = async (line) => {
      for (let i = 0; i < line.length; i++) {
        if (skipped) return;
        el.textContent += line[i];
        await sleep(Math.max(0, charDelayMs + jitter()));
      }
      if (!skipped) {
        el.textContent += "\n";
        await sleep(Math.max(0, lineDelayMs + jitter()));
      }
    };

    await typeLine(buildGreeting());
    await typeLine("");

    for (const line of narrativeLines) {
      if (skipped) return;

      await typeLine(line);

      if (line === "") await sleep(blockGapMs);
      if (longPauseAfter.has(line)) await sleep(longPauseMs);
    }
  }

  function boot() {
    const el = document.getElementById("terminal-policy");
    if (!el) return;

    typeAll(el).catch(() => {
      el.textContent = fullText();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
