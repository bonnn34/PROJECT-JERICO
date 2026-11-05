import { cardPlan, deviceFor, planFor, SECTION_PLANS, type SectionPlan } from "./construction-timeline";
import { createConstructionScene, documentBounds, type Bounds, type Viewport } from "./construction-renderer";

type Preferences = { ready: boolean; enabled: boolean; reducedMotion: boolean };
type Section = { key: string; element: HTMLElement; trigger: HTMLElement; plan: SectionPlan; box: Bounds; triggerBox: Bounds; layoutWidth: number; layoutHeight: number };
type Active = { section: Section; scene: ReturnType<typeof createConstructionScene>; start: number; duration: number };
export type ConstructionCoordinator = ReturnType<typeof createConstructionCoordinator>;

/**
 * One coordinator per homepage visit, one active section, one short-lived RAF.
 * Pending sections are ordinary visible HTML. Cancellation only removes effects.
 */
export function createConstructionCoordinator(overlay: SVGSVGElement, completed: Set<string>) {
  let preferences: Preferences = { ready: false, enabled: false, reducedMotion: false };
  let active: Active | null = null;
  let frame = 0;
  let disposed = false;
  let dirty = true;
  let documentHeight = 0;
  let readyAfter = performance.now() + 100;
  let fastUntil = 0;
  let anchorUntil = location.hash ? performance.now() + 900 : 0;
  let previousScroll = window.scrollY;
  let previousScrollTime = performance.now();
  let lastPaint = 0;
  let costlyFrames = 0;
  const frameInterval = navigator.hardwareConcurrency <= 4 ? 1000 / 30 : 0;
  const viewport: Viewport = { width: innerWidth, height: innerHeight, scrollX, scrollY, header: 73 };
  const collect = (): Section[] => SECTION_PLANS.flatMap(source => {
    const selector = source.id === "hero" ? ".hero" : source.id === "work" ? ".project-card[data-project]" : source.id === "footer" ? ".site-footer" : "#" + source.id;
    return Array.from(document.querySelectorAll<HTMLElement>(selector)).map((element,index) => {
      const key = source.id === "work" ? "work:" + element.dataset.project : source.id;
      const plan = source.id === "work" ? cardPlan(source,index,element.classList.contains("project-card-featured")) : source;
      const trigger = element.querySelector<HTMLElement>(plan.trigger) ?? element;
      element.dataset.constructionSection = plan.id;
      element.dataset.constructionKey = key;
      element.dataset.constructionState = completed.has(key) ? "complete" : "pending";
      return { key, element, trigger, plan, box: documentBounds(element), triggerBox: documentBounds(trigger), layoutWidth: element.offsetWidth, layoutHeight: element.offsetHeight };
    });
  });
  let sections = collect();
  const complete = (section: Section, reason: string) => {
    completed.add(section.key);
    section.element.dataset.constructionState = "complete";
    section.element.dataset.constructionReason = reason;
  };
  const finish = (reason: string) => {
    if (!active) return;
    active.scene.finish();
    complete(active.section, reason);
    active = null;
    overlay.removeAttribute("data-active-section");
    overlay.removeAttribute("data-active-key");
  };
  const measure = () => {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    documentHeight = document.documentElement.scrollHeight;
    viewport.header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 73;
    overlay.style.clipPath = "inset(" + Math.max(0, viewport.header) + "px 0 0 0)";
    sections.forEach(section => {
      section.box = documentBounds(section.element);
      section.triggerBox = documentBounds(section.trigger);
      section.layoutWidth = section.element.offsetWidth;
      section.layoutHeight = section.element.offsetHeight;
    });
    dirty = false;
  };
  const siteReady = () => document.documentElement.dataset.siteReady === "true" || document.documentElement.classList.contains("preloader-skip");
  const inView = (section: Section) => section.box.y - viewport.scrollY < viewport.height && section.box.y + section.box.height - viewport.scrollY > viewport.header + 12;
  const eligible = (section: Section) => {
    const top = section.triggerBox.y - viewport.scrollY;
    const threshold = section.plan.id === "work" ? .3 : section.plan.id === "contact" ? .3 : section.plan.id === "footer" ? .88 : .7;
    const footerAtEnd = section.plan.id === "footer" && viewport.scrollY + viewport.height >= documentHeight - 2;
    return (top < viewport.height * threshold || footerAtEnd) && top + section.triggerBox.height > viewport.header + 20;
  };
  const request = () => { if (!disposed && !frame) frame = requestAnimationFrame(tick); };
  function tick(now: number) {
    frame = 0;
    if (disposed) return;
    if (dirty) measure();
    viewport.scrollX = window.scrollX;
    viewport.scrollY = window.scrollY;
    if (!preferences.ready || !siteReady() || document.hidden || document.body.classList.contains("nav-open")) return;
    // Releasing the preloader restores the scrollbar. Let that layout settle
    // before capturing targets so the first ResizeObserver does not cancel Hero.
    if (now < readyAfter) { request(); return; }

    if (active && !inView(active.section)) finish("left-viewport");
    if (active && (now < fastUntil || now < anchorUntil)) finish("navigation");
    if (active) {
      if (now - lastPaint < frameInterval) { request(); return; }
      lastPaint = now;
      const elapsed = now - active.start;
      active.section.element.dataset.constructionTime = String(Math.round(elapsed));
      const paintStart = performance.now();
      active.scene.paint(elapsed, viewport);
      costlyFrames = performance.now() - paintStart > 12 ? costlyFrames + 1 : Math.max(0, costlyFrames - 1);
      if (elapsed >= active.duration) finish("finished");
      else if (costlyFrames >= 5) finish("performance");
    }
    for (const section of sections) {
      if (completed.has(section.key) || active?.section === section) continue;
      if (section.box.y + section.box.height - viewport.scrollY < viewport.header || section.triggerBox.y + section.triggerBox.height - viewport.scrollY < viewport.header) {
        complete(section, "passed");
      } else if (preferences.reducedMotion) {
        complete(section, "reduced-motion");
      } else if (inView(section) && (now < fastUntil || now < anchorUntil)) {
        complete(section, now < anchorUntil ? "anchor" : "fast-scroll");
      } else if (eligible(section)) {
        if (!preferences.enabled) { complete(section, "disabled"); continue; }
        if (active) continue;
        const device = deviceFor(viewport.width);
        const plan = planFor(section.plan, device);
        const scene = createConstructionScene(section.element, plan, device, overlay, viewport);
        if (!scene.count) { complete(section, "no-visible-targets"); continue; }
        section.element.dataset.constructionState = "active";
        section.element.dataset.constructionRuns = String(Number(section.element.dataset.constructionRuns || 0) + 1);
        overlay.dataset.activeSection = section.plan.id;
        overlay.dataset.activeKey = section.key;
        active = { section, scene, start: now, duration: scene.duration };
        costlyFrames = 0;
        scene.paint(0, viewport);
      }
    }
    if (active) request();
  }
  const onScroll = () => {
    const now = performance.now();
    const distance = Math.abs(window.scrollY - previousScroll);
    const speed = distance / Math.max(16, now - previousScrollTime);
    if (distance > viewport.height * .7 || (distance > 100 && speed > 5)) {
      fastUntil = now + 160;
      finish("fast-scroll");
    }
    if (now < anchorUntil) anchorUntil = now + 180;
    previousScroll = window.scrollY;
    previousScrollTime = now;
    request();
  };
  const onResize = () => {
    if (window.innerWidth !== viewport.width) finish("resize");
    dirty = true; request();
  };
  const resolveHash = (hash: string) => {
    let id = "";
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    return sections.find(section => section.plan.id === id || (section.plan.id === "hero" && (id === "top" || id === "main-content")) || section.element.querySelector('[id="' + CSS.escape(id) + '"]'));
  };
  const anchor = (hash: string) => {
    const destination = resolveHash(hash);
    if (destination) sections.filter(section => section.plan.id === destination.plan.id).forEach(section => complete(section, "anchor"));
    finish("anchor");
    anchorUntil = performance.now() + 400;
    request();
  };
  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (active && target && active.section.element.contains(target)) finish("interaction");
    const link = target?.closest<HTMLAnchorElement>("a[href]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) anchor(url.hash);
  };
  const onFocus = (event: FocusEvent) => {
    if (active && event.target instanceof Node && active.section.element.contains(event.target)) finish("keyboard");
  };
  const onPointerDown = (event: PointerEvent) => {
    // A touch on a card can begin a scroll. Only an actual tap/click commits it.
    if (event.pointerType === "touch") return;
    if (active && event.target instanceof Element && event.target.closest("a,button,[role=button]") && active.section.element.contains(event.target)) finish("interaction");
  };
  const onHidden = () => { if (document.hidden) finish("hidden-tab"); request(); };
  const onHash = () => anchor(location.hash);
  const onReady = () => { readyAfter = performance.now() + 100; dirty = true; request(); };
  const intersection = new IntersectionObserver(request, { threshold: [0, .01, .2], rootMargin: "-74px 0px -12% 0px" });
  const resize = new ResizeObserver(entries => {
    const changed = entries.some(entry => {
      const section = sections.find(s => s.element === entry.target);
      return section && (Math.abs(section.element.offsetWidth - section.layoutWidth) > 1 || Math.abs(section.element.offsetHeight - section.layoutHeight) > 1);
    });
    if (active && changed) finish("layout-change");
    dirty = true; request();
  });
  const menu = new MutationObserver(() => { if (document.body.classList.contains("nav-open")) finish("menu"); request(); });
  sections.forEach(section => { intersection.observe(section.trigger); resize.observe(section.element); });
  const gallery = new MutationObserver(() => {
    finish("filter");
    intersection.disconnect(); resize.disconnect();
    sections = collect();
    sections.forEach(section => { intersection.observe(section.trigger); resize.observe(section.element); });
    dirty = true; request();
  });
  const grid = document.querySelector(".projects-grid");
  if (grid) gallery.observe(grid, { childList: true });
  menu.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("hashchange", onHash);
  window.addEventListener("project-jerico:ready", onReady);
  document.addEventListener("click", onClick, true);
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("focusin", onFocus);
  document.addEventListener("visibilitychange", onHidden);
  if (location.hash) anchor(location.hash);

  return {
    setPreferences(next: Preferences) {
      preferences = next;
      if (!next.enabled || next.reducedMotion) finish(next.reducedMotion ? "reduced-motion" : "disabled");
      request();
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      finish("unmount");
      intersection.disconnect(); resize.disconnect(); menu.disconnect(); gallery.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("project-jerico:ready", onReady);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", onHidden);
    },
  };
}
