# Jerico Ibalin | Modern Developer Editorial Portfolio

A complete Next.js App Router portfolio starter with a warm ivory / charcoal design, editorial headings, responsive layouts, project filtering, six project case studies, resume page, and contact section.

## 1. Run locally

Requires Node.js **20.9+** (Node 22+ recommended).

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Or with pnpm:

```bash
pnpm install
pnpm dev
```

If port 3000 is occupied, Next.js usually moves to the next available port, or run `npm run dev -- --port 3001`.

## 2. Personalize before publishing

Edit `data/portfolio.ts`:

1. `profile`: update the role, description, email, location, GitHub/LinkedIn URLs, and optional resume PDF path.
2. `projects`: update project copy, screenshots, tools, links, and case studies. Only put real URLs into `liveUrl` and `repositoryUrl`. Missing links stay hidden.
3. `experience`: add your **real** employer names and dates, and correct the statements.
4. `competencies`: only keep skills you can confidently discuss.
5. `/app/resume/page.tsx`: add your verified education, certifications, achievements, dates, and any other resume details. The current page is deliberately a draft, not a finished job application.

### Project screenshots

This starter contains six original, **illustrative SVG mockups**, not screenshots of your real projects. Replace images in `public/projects/` with screenshots of your actual work (WebP or PNG recommended), and update each project `image` path. For best results, use a 1440×870 image or a similar landscape ratio.

If you want a real photo in the About section, replace the decorative monogram in the `about-art` portion of `app/page.tsx`.

### Contact section

`profile.email` is blank on purpose. The page shows a configuration reminder until your genuine address is added. After you add it, the section automatically becomes a working `mailto:` link. The GitHub and LinkedIn links also appear only when you set them.

### Resume download

The `/resume` page includes a working **Print / Save as PDF** button. This uses your browser's print dialog and A4 print styles. You can also place your own verified PDF in `/public` and set `profile.cvPdf` to the PDF path, which enables a direct download button.

### Fonts

The design uses **DM Sans + Instrument Serif** via a CSS Google Fonts import with built-in system-font fallbacks. It does not use `next/font/google`, so your Next.js build does not depend on downloading Google Fonts at build time. For sites that must work entirely offline, remove the CSS `@import` line and use the fallback fonts.

## 3. Build and deploy

```bash
npm run typecheck
npm run build
```

Push the folder to GitHub, then import the repo into Vercel. Framework preset: **Next.js**; build command: `next build`.

Update `metadataBase` in `app/layout.tsx` from `https://example.com` to your own actual deployed URL **before launch**.

## File map

- `app/page.tsx` — homepage sections and editorial hero
- `app/globals.css` — all styling, color tokens, responsive breakpoints, reduced motion, and print layout
- `app/projects/[slug]/page.tsx` — dynamically generated case study routes
- `app/resume/page.tsx` — resume / browser PDF export
- `components/project-gallery.tsx` — interactive project category filters
- `components/site-header.tsx` — accessible mobile navigation
- `components/site-footer.tsx` — footer
- `data/portfolio.ts` — editable profile and project data
- `public/projects/` — included original illustration mockups

## What is and isn't wired up

- ✅ Project filters, navigation, project pages, resume printing, internal links, mobile menu
- ✅ Responsive screens, accessible focus states, reduced-motion preference
- ⚙️ Email, social profiles, and optional project/demo links require your genuine URLs
- ⚙️ A separate contact-form backend is **not** included; direct email contact is enabled by supplying your email
- ⚙️ Real screenshot imagery, education, employer names, dates, and achievements require your verified details

No made-up companies, portfolio statistics, work dates, social URLs, or contact addresses were used.
