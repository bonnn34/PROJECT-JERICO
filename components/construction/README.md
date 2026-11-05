# Scroll-driven portfolio construction

The real homepage uses one body-level SVG overlay, one coordinator, and one active construction scene. Pending content is ordinary, visible HTML. All temporary transforms, masks, guides, and cursors are removed on completion or interruption; links and accessible text remain intact.

## Timing and ownership

construction-timeline.ts defines seven agent identities and deterministic approach → pause → press → construct → align → exit phases. Desktop approaches take 700–750ms, with 150–180ms pauses and presses. Hero lasts about 4.7 seconds, each project card about seven seconds, supporting sections about 2.5 seconds, and the footer about one second.

The renderer measures the real elements and glyphs when a scene begins. Dragging and resizing use the same progress for the element, selection, handles, and cursor. Short text reveals at 38ms per character with a caret at the actual glyph boundary; longer supporting text uses a readable mask. Original text nodes and accessible names are unchanged. Measured text durations are scheduled again to prevent overlapping assignments and keep QA after construction.

Desktop has up to three Hero cursors and four Work cursors; tablet has at most two; phone has one. Mobile cards have a separate selection, image, title, and QA sequence with small vertical placement. The coordinator limits low-core devices to 30 updates per second and safely finishes effects if painting repeatedly exceeds its budget.

## Activation and cleanup

Each project card has a stable data-project slug and its own completed ID. A gallery observer rebinds cards after filtering without replaying completed projects. Other sections run once per homepage visit. Theme changes do not recreate the coordinator.

Scroll coordinates use cached document geometry. Width/layout changes safely finish effects; mobile browser height changes update the viewport without cancelling. Touch-down can begin a normal scroll; actual taps, clicks, or keyboard focus finalize effects before interaction. Fast scrolling, anchor navigation, hidden tabs, menu opening, reduced motion, and unmounting also clean up immediately.

The existing preloader retains its timing and visuals. The coordinator waits for its ready event and scrollbar restoration. The BUILD ANIMATION menu switch persists locally; reduced motion overrides it. No animation runs while the menu is open or before the preloader releases the page.

## Files

- construction-timeline.ts: phase timing, responsive choreography, measured-content scheduling.
- construction-renderer.ts: DOM/glyph geometry, synchronized SVG drawing, transient styles and cleanup.
- construction-coordinator.ts: section/card observation, completion IDs, lifecycle and performance.
- global-agent-overlay.tsx and construction.css: decorative cursor, selection, caret, and guide visuals.
- ../project-gallery.tsx: stable project identifiers.
- ../measurement-overlay.tsx: renders measurement labels only for positive, finite dimensions.
- ../../app/globals.css, ../site-preloader.tsx, and ../site-header.tsx: reserve scrollbar space and overlap status text to prevent preloader/menu layout shifts, preserving the preloader's timing.

## Verification

Run:

    node --experimental-strip-types tests/construction-timeline.test.mjs
    npm run typecheck
    npm run build

Five dependency-free timeline tests cover phase order, continuous motion, cursor ownership, responsive limits, long titles, and QA ordering. The repository does not configure a lint script.

Browser validation uses a production build in local Chrome. The reference card was checked before scaling; the desktop gallery and all supporting sections were then checked. Phone checks at 320, 360, 375, 390, 430, and 480px include two independently activated cards, real touch gestures, viewport-height changes, single-cursor density, no horizontal overflow, and zero measured layout shift.

Additional checks passed at 768, 1024, 1440, and 1920px. The final browser checks covered fresh-load preloader sequencing, zero preloader layout-shift entries, measured labels after hover/resize, theme persistence, filtering without replay, restored image hover, all seven project routes, resume and contact links, persistent animation settings, keyboard activation, reduced motion at load and during playback, fast/reverse scrolling, anchor navigation, hidden tabs, and route-unmount cleanup. No JavaScript exceptions were observed. These are Chrome desktop and mobile-emulation checks, not physical-device measurements.
