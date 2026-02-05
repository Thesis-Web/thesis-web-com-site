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

    const templates = [
      {
        prefix: "es",
        text: (b) =>
          `${tod === "morning" ? "Buenos días" : tod === "afternoon" ? "Buenas tardes" : "Buenas noches"}. ` +
          `Bienvenido usuario (${b}). Idioma: ${langFull}.`,
      },
      {
        prefix: "fr",
        text: (b) =>
          `${tod === "morning" ? "Bonjour" : tod === "afternoon" ? "Bon après-midi" : "Bonsoir"}. ` +
          `Bienvenue utilisateur (${b}). Langue : ${langFull}.`,
      },
      {
        prefix: "de",
        text: (b) =>
          `${tod === "morning" ? "Guten Morgen" : tod === "afternoon" ? "Guten Tag" : "Guten Abend"}. ` +
          `Willkommen Nutzer (${b}). Sprache: ${langFull}.`,
      },
      {
        prefix: "pt",
        text: (b) =>
          `${tod === "morning" ? "Bom dia" : tod === "afternoon" ? "Boa tarde" : "Boa noite"}. ` +
          `Bem-vindo usuário (${b}). Idioma: ${langFull}.`,
      },
      {
        prefix: "it",
        text: (b) =>
          `${tod === "morning" ? "Buongiorno" : tod === "afternoon" ? "Buon pomeriggio" : "Buonasera"}. ` +
          `Benvenuto utente (${b}). Lingua: ${langFull}.`,
      },
      {
        prefix: "nl",
        text: (b) =>
          `${tod === "morning" ? "Goedemorgen" : tod === "afternoon" ? "Goedemiddag" : "Goedenavond"}. ` +
          `Welkom gebruiker (${b}). Taal: ${langFull}.`,
      },
      {
        prefix: "en",
        text: (b) =>
          `${tod === "morning" ? "Good morning" : tod === "afternoon" ? "Good afternoon" : "Good evening"}. ` +
          `Welcome (${b}) user. Language: ${langFull}.`,
      },
    ];

    const match = templates.find((t) => lang.startsWith(t.prefix));
    return match ? match.text(browser) : templates[templates.length - 1].text(browser);
  };

  const narrativeLines = [
    "Support channel: open.",
    "",
    "This project is independent.",
    "No ads. No token sales. No paywall.",
    "",
    "If the work is useful, support keeps it moving:",
    "• research time",
    "• infrastructure + hosting",
    "• writing + public documentation",
    "",
    "Venmo person-to-person transfers typically avoid processing fees.",
    "PayPal may apply standard processing fees.",
    "",
    "Thank you. Seriously.",
    "End of message.",
  ];

  const fullText = () => [buildGreeting(), "", ...narrativeLines].join("\n");

  async function typeAll(el) {
    const charDelayMs = 24;
    const jitterMs = 10;
    const lineDelayMs = 220;
    const blockGapMs = 550;
    const longPauseMs = 900;

    const longPauseAfter = new Set([
      "If the work is useful, support keeps it moving:",
      "Venmo person-to-person transfers typically avoid processing fees.",
      "Thank you. Seriously.",
      "End of message.",
    ]);

    let skipped = false;
    const skip = () => {
      if (skipped) return;
      skipped = true;
      el.textContent = fullText();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") skip();
    };

    document.addEventListener("keydown", onKeyDown, { passive: true });
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
    const el = document.getElementById("terminal-donate");
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
