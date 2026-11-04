# Scroll-triggered portfolio construction

The real homepage has one body-level SVG overlay and one coordinator. Hero and Selected Work use the richest choreography; supporting sections have shorter sequences. The miniature showcase has been removed.

Content is visible server-rendered HTML. Only active targets receive temporary opacity, mask, translate, and scale properties. Text nodes, links, section heights, and React component state are never replaced. The text effect progressively restores full ink while keeping the remaining text readable and available to assistive technologies.

**construction-timeline.ts** defines seven reusable identities and section plans. An action contains its agent, DOM selector, approach time, edit duration, effect, and placement offset. Desktop limits are three cursors for Hero, four for Work, one or two elsewhere. Tablet plans cap at two. Phone plans use brief opacity refinement without cursors, dragging, resizing, or text masks.

**construction-coordinator.ts** observes real sections. It keeps completed IDs for the homepage component's lifetime and permits only one active section. An active sequence owns the sole animation frame loop; idle rendering stops. Target geometry is cached on activation, viewport scrolling uses document coordinates, and resize/layout changes safely finalize effects before remeasurement. A short settling interval after the preloader exits avoids capturing the scrollbar transition.

Fast scrolling, leaving the viewport, backgrounding the tab, resizing, opening the menu, keyboard focus, and interacting with an active section finalize it. Anchor links and initial hashes skip destination construction and allow the browser's normal scrolling. Pending content is never hidden, including when JavaScript is unavailable.

**construction-preferences.tsx** supplies the existing menu's BUILD ANIMATION switch. Its local preference persists under project-jerico-build-animation. Reduced motion overrides it. Disabling finishes active effects; sections visited while disabled are marked complete. Re-enabling permits only unvisited sections. Theme changes do not recreate the coordinator or reset completion.

**construction-renderer.ts** ties the pointer and selection geometry to the real target's transient transform. It batches DOM measurements at activation and caches SVG attributes. **construction.css** scopes effects and temporarily suppresses competing measurement/selection overlays only while a section is active. Cleanup restores the original CSS and normal hover behavior.

The existing PJ preloader emits project-jerico:ready after its exit (or immediate skip). Its visuals and timings are retained. Hero's previous automatic CSS entrance is replaced by the coordinator; the identity switcher's arrow transitions remain.

Checks (Node 22.6+ for the dependency-free timeline tests):

    node --experimental-strip-types tests/construction-timeline.test.mjs
    npm run typecheck
    npm run build

The project has no lint script or lint dependency. Browser checks cover natural and rapid scrolling, reverse scrolling, anchor navigation, preloader sequencing, menu settings, theme changes, project filtering, keyboard interaction, reduced motion, and the requested 320–1920px viewport range.
