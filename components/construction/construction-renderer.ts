import { actionAt, clamp, endAt, scheduleForContent, type Device, type SectionPlan } from "./construction-timeline";

export type Bounds = { x: number; y: number; width: number; height: number };
export type Viewport = { width: number; height: number; scrollX: number; scrollY: number; header: number };
export const documentBounds = (element: Element): Bounds => {
  const b = element.getBoundingClientRect();
  return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height };
};
const properties = ["--construction-x", "--construction-y", "--construction-scale", "--construction-mask", "--construction-border"];
const valid = (b: Bounds) => [b.x, b.y, b.width, b.height].every(Number.isFinite) && b.width > 0 && b.height > 0;

/** Cache glyph geometry without replacing the original accessible text. */
function glyphsFor(element: HTMLElement, box: Bounds) {
  if ((element.textContent?.length ?? 0) > 80) return [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const glyphs: Bounds[] = [];
  const range = document.createRange();
  let node: Node | null;
  while ((node = walker.nextNode())) {
    for (let i = 0; i < (node.textContent?.length ?? 0); i++) {
      range.setStart(node, i); range.setEnd(node, i + 1);
      const b = range.getBoundingClientRect();
      if (b.width && b.height) glyphs.push({ x: b.left + scrollX - box.x, y: b.top + scrollY - box.y, width: b.width, height: b.height });
    }
  }
  return glyphs;
}
function textMask(glyphs: Bounds[], count: number, box: Bounds) {
  const lines: Bounds[] = [];
  glyphs.slice(0, count).forEach(glyph => {
    const line = lines.find(b => Math.abs(b.y - glyph.y) < 2);
    if (line) line.width = glyph.x + glyph.width - line.x;
    else lines.push({ ...glyph });
  });
  const rects = lines.map(b => '<rect x="' + Math.max(0, b.x - 1) + '" y="' + Math.max(0, b.y - 2) + '" width="' + (b.width + 2) + '" height="' + (b.height + 4) + '" fill="white"/>').join("");
  return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + box.width + '" height="' + box.height + '"><rect width="100%" height="100%" fill="white" opacity=".28"/>' + rects + '</svg>') + '")';
}

export function createConstructionScene(section: HTMLElement, plan: SectionPlan, device: Device, overlay: SVGSVGElement, view: Viewport) {
  const actors = plan.actions.flatMap(source => {
    const element = source.target === ":scope" ? section : section.querySelector<HTMLElement>(source.target);
    if (!element) return [];
    const box = documentBounds(element);
    if (!valid(box)) return [];
    const shortHeading = plan.id === "hero" || plan.id === "work" || (element.textContent?.length ?? 0) <= 22;
    const glyphs = source.kind === "type" && shortHeading ? glyphsFor(element, box) : [];
    const action = { ...source, duration: glyphs.length ? glyphs.length * 38 : source.duration };
    const group = overlay.querySelector<SVGGElement>('[data-global-agent="' + action.agent + '"]')!;
    const bottomVisible = box.y + box.height - view.scrollY < view.height - 40;
    const anchor: readonly [number, number] = action.kind === "resize" ? [1, bottomVisible ? 1 : 0] : action.kind === "inspect" ? [.92, .12] : [.76, .12];
    return [{ action, element, box, glyphs, group, anchor, lastGlyph: -1,
      border: action.kind === "style" ? getComputedStyle(element).borderBottomColor : "",
      selection: group.querySelector<SVGGElement>("[data-agent-selection]")!,
      frame: group.querySelector<SVGRectElement>("[data-agent-box]")!,
      guides: group.querySelector<SVGPathElement>("[data-agent-guides]")!,
      handles: Array.from(group.querySelectorAll<SVGRectElement>("[data-agent-handle]")),
      label: group.querySelector<SVGTextElement>("[data-agent-action]")!,
      check: group.querySelector<SVGGElement>("[data-agent-check]")!,
      caret: group.querySelector<SVGPathElement>("[data-agent-caret]")!,
      pointer: group.querySelector<SVGGElement>("[data-agent-pointer]")!,
      arrow: group.querySelector<SVGPathElement>("[data-agent-arrow]")!,
      click: group.querySelector<SVGCircleElement>("[data-agent-click]")!,
      tag: group.querySelector<SVGGElement>("[data-agent-tag]")!,
    }];
  });
  const scheduled = scheduleForContent(actors.map(actor => actor.action), device, plan.id);
  actors.forEach((actor, index) => { actor.action = scheduled[index]; });
  const touched = new Set<HTMLElement>();
  const groups = Array.from(overlay.querySelectorAll("[data-global-agent]"));
  const attributes = new WeakMap<Element, Map<string, string>>();
  const set = (node: Element, key: string, value: number | string) => {
    let cache = attributes.get(node);
    if (!cache) { cache = new Map(); attributes.set(node, cache); }
    const next = String(value);
    if (cache.get(key) === next) return;
    cache.set(key, next);
    if (key === "text") node.textContent = next;
    else node.setAttribute(key, next);
  };
  const restore = (element: HTMLElement) => {
    if (!touched.has(element)) return;
    properties.forEach(property => element.style.removeProperty(property));
    element.removeAttribute("data-construction-target");
    element.removeAttribute("data-construction-effect");
    touched.delete(element);
  };
  return {
    count: actors.length,
    duration: Math.max(plan.duration, ...actors.map(a => endAt(a.action))),
    paint(time: number, viewport: Viewport) {
      // Queued actions cannot hide the same agent's current assignment.
      groups.forEach(group => set(group, "opacity", 0));
      const active = actors.filter(a => actionAt(a.action, time, device).active && a.element.isConnected);
      touched.forEach(element => { if (!active.some(a => a.element === element)) restore(element); });
      for (const actor of active) {
        const { action, element, box, glyphs } = actor;
        const state = actionAt(action, time, device);
        if (state.editing && action.kind !== "frame" && action.kind !== "inspect") {
          touched.add(element);
          element.dataset.constructionTarget = "";
          element.dataset.constructionEffect = action.kind;
          element.style.setProperty("--construction-x", state.x.toFixed(3) + "px");
          element.style.setProperty("--construction-y", state.y.toFixed(3) + "px");
          element.style.setProperty("--construction-scale", String(state.scale));
          if (action.kind === "type") {
            const count = Math.min(glyphs.length, Math.floor(state.raw * glyphs.length));
            if (count !== actor.lastGlyph || !glyphs.length) {
              actor.lastGlyph = count;
              element.style.setProperty("--construction-mask", state.raw === 1 ? "none" : glyphs.length ? textMask(glyphs, count, box) : "linear-gradient(90deg,#000 " + state.raw * 100 + "%,#0006 " + (state.raw * 100 + 2) + "%)");
            }
          }
          if (action.kind === "style") element.style.setProperty("--construction-border", "color-mix(in srgb," + actor.border + " " + (40 + state.progress * 60) + "%,transparent)");
        }
        let x = box.x - viewport.scrollX + state.x, y = box.y - viewport.scrollY + state.y;
        const width = box.width * state.scale, height = box.height * state.scale;
        for (const parent of active) if (parent.element !== element && parent.element.contains(element)) {
          const parentState = actionAt(parent.action, time, device);
          x += parentState.x; y += parentState.y;
        }
        let targetX = x + width * actor.anchor[0], targetY = y + height * actor.anchor[1];
        if (action.kind === "type" && glyphs.length) {
          const count = state.editing ? Math.min(glyphs.length, Math.floor(state.raw * glyphs.length)) : 0;
          const glyph = glyphs[Math.max(0, count - 1)];
          targetX = x + glyph.x + (count ? glyph.width : 0);
          targetY = y + Math.min(box.height, glyph.y + glyph.height);
          set(actor.caret, "d", "M" + targetX + " " + (y + Math.max(0, glyph.y)) + "V" + targetY);
          set(actor.caret, "opacity", state.editing && !state.aligning ? 1 : 0);
          targetX += 8; targetY += 5;
        } else set(actor.caret, "opacity", 0);
        const fromX = clamp(targetX + (action.agent % 2 ? -95 : 85), 16, viewport.width - 24);
        const fromY = clamp(targetY - 65, viewport.header + 18, viewport.height - 30);
        const cursorX = fromX + (targetX - fromX) * state.approach + state.departure * 16;
        const cursorY = fromY + (targetY - fromY) * state.approach + state.departure * 12;
        const visible = cursorX >= 4 && cursorX < viewport.width - 8 && cursorY > viewport.header + 8 && cursorY < viewport.height - 16;
        set(actor.group, "opacity", visible ? state.cursorOpacity : 0);
        set(actor.group, "data-action", action.kind);
        set(actor.group, "data-phase", state.aligning ? "align" : state.editing ? "construct" : state.selected ? "press" : state.approach === 1 ? "pause" : "approach");
        set(actor.pointer, "transform", "translate(" + cursorX + " " + cursorY + ")");
        set(actor.arrow, "transform", "scale(" + (1 - .16 * Math.sin(state.click * Math.PI)) + ")");
        set(actor.click, "r", 3 + state.click * 13);
        set(actor.click, "opacity", state.click ? (1 - state.click) * .7 : 0);
        set(actor.tag, "transform", "translate(" + (cursorX > viewport.width - 110 ? -87 : 14) + " " + (cursorY > viewport.height - 62 ? -24 : 25) + ")");
        set(actor.selection, "opacity", state.selected ? .85 : 0);
        set(actor.frame, "x", x); set(actor.frame, "y", y); set(actor.frame, "width", width); set(actor.frame, "height", height);
        [[x,y],[x+width,y],[x,y+height],[x+width,y+height]].forEach((point,i) => {
          set(actor.handles[i], "x", point[0] - 2.5); set(actor.handles[i], "y", point[1] - 2.5);
          set(actor.handles[i], "opacity", action.kind === "type" ? 0 : 1);
        });
        set(actor.guides, "d", "M" + Math.max(8, x-18) + " " + y + "H" + Math.min(viewport.width-8, x+width+18) + " M" + x + " " + Math.max(viewport.header+8,y-18) + "V" + Math.min(viewport.height-8,y+height+18));
        set(actor.guides, "opacity", state.aligning || action.kind === "frame" ? .7 : .12);
        set(actor.label, "x", clamp(x, 12, viewport.width - 155)); set(actor.label, "y", clamp(y-9, viewport.header+18, viewport.height-14));
        set(actor.label, "text", action.kind === "resize" ? Math.round(width) + " × " + Math.round(height) + " PX" : action.kind === "inspect" ? "ALIGNMENT / CHECK" : state.aligning ? "ALIGNED / " + plan.id.toUpperCase() : action.kind.toUpperCase() + " / " + plan.id.toUpperCase());
        set(actor.check, "transform", "translate(" + (x+width-10) + " " + (y+12) + ")");
        set(actor.check, "opacity", action.kind === "inspect" && state.progress > .55 ? 1 : 0);
      }
    },
    finish() { touched.forEach(restore); groups.forEach(group => set(group, "opacity", 0)); },
  };
}
