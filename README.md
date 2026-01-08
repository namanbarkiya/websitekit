# WebsiteKit

**WebsiteKit** is a toolkit that helps you prepare websites for production by generating essential setup assets and best‑practice snippets in one place.

- **Live**: `https://websitekit.dev`

## What you can do (today)

- **Website Assets**: set your site name, domain, description, primary color, and logo once (stored locally) and reuse it across tools.
- **Meta Tags**: generate SEO, Open Graph, and X/Twitter meta tags with a live preview.
- **QR Code**: generate QR codes for URLs/text with SVG/PNG export.

Most other tools are intentionally marked **Coming soon** while the core UX and tool system stabilizes.

## Local development

### Prerequisites

- Node.js 20+

### Install & run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Useful scripts

```bash
npm run lint
npm run type-check
npm run build
npm run check:all
npm run format
```

## Tech stack

- **Next.js (App Router)** + **React**
- **Tailwind CSS**
- **Radix UI** primitives
- **Zustand** for local state

## Repo notes

- **Tools live under** `lib/tools/*` and are registered via `lib/tools/index.ts`.
- **Tool host page** is `app/tools/[toolId]/page.tsx`.
- **Sidebar + tool catalog** config is `config/sidebar.ts`.

## Contributing

PRs are welcome—especially new tools that follow the existing tool pattern.

## License

See `LICENSE`.
