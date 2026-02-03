# ThesisWeb.com — Public Landing Site

Public-facing static site for **The Thesis Project**.

This repository contains the code for the public informational site hosted at
**thesisweb.com**. The site is intentionally minimal and focused on narrative,
clarity, and performance.

Its goals are to:
- Present the high-level thesis behind the project
- Capture interest and launch-day access requests
- Provide a public, non-proprietary entry point

Deeper technical design, research, and development workflows are intentionally gated
and not exposed through this repository.

---

## Tech Stack

- **Astro** (static-first, zero-runtime by default)
- **TypeScript (strict)**
- **Tailwind CSS**
- Static HTML output

The stack is chosen for performance, SEO, long-term maintainability,
and low operational complexity.

---

## Development

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

The dev server runs at:

```
http://localhost:5173
```

---

## Build

Generate a production build:

```bash
npm run build
```

Static output is generated in:

```
dist/
```

---

## Deployment

This site is deployed as static assets behind **nginx**.

Typical deployment flow:

```bash
npm ci
npm run build
rm -rf /var/www/thesisweb.com/html/*
cp -r dist/* /var/www/thesisweb.com/html/
```

---

## License

MIT

