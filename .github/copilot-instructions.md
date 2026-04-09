# Copilot Instructions for KDInsight

## Build, lint, and run commands
- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Build for production: `npm run build`
- Run built app: `npm run start`
- Create static export: `npm run generate` (runs `next build && next export`)
- Lint: `npm run lint`
- Format: `npm run format`

### Tests
- No test runner is configured in this repo (`package.json` has no `test` script, and there are no source `*.test.*`/`*.spec.*` files).
- Single-test command: not currently available.

## High-level architecture
- This is a **Next.js Pages Router** site. Route entrypoints are in `pages/`.
  - `pages/index.tsx` composes the landing experience (`Banner`, `Pillars`, `About`, `CTA`).
  - `pages/sponsor.tsx` and `pages/career.tsx` compose section components under `components/Sponsor/*` and `components/career/*`.
  - Legal pages (`privacy-and-cookies`, `terms-of-service`, `confidentiality-agreement`) render HTML constants from `utils/index.ts` via `dangerouslySetInnerHTML`.
- Shared page shell is centralized in `components/Layouts/MainLayout.tsx`, which always renders `Navbar`, `Sidebar`, and `Footer` around page content.
- App-level wiring:
  - `pages/_app.tsx` loads global SCSS (`styles/app.scss`), font definitions (`styles/fonts.scss`), and Emotion cache provider setup.
  - `pages/_document.tsx` injects favicon metadata and analytics scripts, reading `GA_TRACKING_ID` and `MS_CLARITY_ID` from environment variables.
- Contact flow is frontend-only: `components/CTA/index.tsx` posts directly to a Salesforce WebToLead endpoint and shows success feedback using `components/Toast`.

## Key conventions for this codebase
- Use **root-based imports** (`components/...`, `styles/...`, `utils`, `types/...`) rather than deep relative imports. This relies on `baseUrl: "."` in `tsconfig.json`.
- Content-heavy section data is usually colocated inside the section component file (for example: `components/Pillars/index.tsx`, `components/About/index.tsx`, `components/Sponsor/*`), with lightweight shared types in `types/*`.
- In-page deep-link behavior follows a query-param + scroll helper pattern:
  - navigation uses `/?cta=true` and `/?about-us=true`
  - `pages/index.tsx` reads those query params and calls `handleMoveToId` from `utils/index.ts`
  - `handleMoveToId` defaults to the `cta` section with offset `-85`
- Styling is intentionally hybrid:
  - global primitives/utilities come from `styles/app.scss` and imported partials
  - component-level styles use `*.module.scss`
  - MUI is used heavily for layout primitives/icons alongside SCSS
- Navigation entries are duplicated in both `components/Navbar/index.tsx` and `components/Sidebar/index.tsx`; keep both in sync when changing menu structure.
- Legal policy text is maintained as raw HTML constants in `utils/index.ts`; update those constants (not page JSX) when policy copy changes.
- Per `README.md`, product messaging is organized around four RAQT pillars (Research Solutions, Quantitative Analysis, Data Analytics, Fintech Solutions). Keep page copy and section composition aligned with those pillars.
