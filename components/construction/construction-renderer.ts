import { actionAt, clamp, endAt, type ConstructionAction, type Device, type SectionPlan } from "./construction-timeline";

export type Bounds = { x: number; y: number; width: number; height: number };
export type Viewport = { width: number; height: number; scrollX: number; scrollY: number; header: number };
export const documentBounds = (element: Element): Bounds => {
  const box = element.getBoundingClientRect();
  return { x: box.left + window.scrollX, y: box.top + window.scrollY, width: box.width, height: box.height };
};
const properties = ["--construction-x", "--construction-y", "--construction-scale", "--construction-opacity", "--construction-mask", "--construction-border"];

/** Geometry is read once when a sequence starts. Scroll updates subtract the
 * viewport offset; resizes safely finish the sequence before measuring again. */
export function createConstructionScene(section: HTMLElement, plan: SectionPlan, device: Device, overlay: SVGSVGElement, view: Viewport) {
  const actors = plan.actions.flatMap(action => {
    const element = section.querySelector<HTMLElement>(action.target);
    if (!element) return [];
    const box = documentBounds(element);
    const top = box.y - view.scrollY;
    if (top > view.height - 30 || top + box.height < view.header + 16 || !box.width || !box.height) return [];
    const group = overlay.querySelector<SVGGElement>('[data-global-agent="' + action.agent + '"]')!;
    return [{
      action, element, box, group,
      characters: Math.max(1, Math.min(120, element.textContent?.trim().length || 40)),
      border: action.kind === "style" ? getComputedStyle(element).borderBottomColor : "",
      selection: group.querySelector<SVGGElement>("[data-agent-selection]")!,
      frame: group.querySelector<SVGRectElement>("[data-agent-box]")!,
      guides: group.querySelector<SVGPathElement>("[data-agent-guides]")!,
      handles: Array.from(group.querySelectorAll<SVGRectElement>("[data-agent-handle]")),
      label: group.querySelector<SVGTextElement>("[data-agent-action]")!,
      check: group.querySelector<SVGGElement>("[data-agent-check]")!,
      pointer: group.querySelector<SVGGElement>("[data-agent-pointer]")!,
      arrow: group.querySelector<SVGPathElement>("[data-agent-arrow]")!,
      click: group.querySelector<SVGCircleElement>("[data-agent-click]")!,
      tag: group.querySelector<SVGGElement>("[data-agent-tag]")!,
    }];
  });
  const touched = new Set<HTMLElement>();
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
  const hide = () => overlay.querySelectorAll("[data-global-agent]").forEach(node => node.setAttribute("opacity", "0"));

  return {
    count: actors.length,
    paint(time: number, viewport: Viewport) {
      for (const actor of actors) {
        const { action, element, box } = actor;
        const state = actionAt(action, time, device);
        set(actor.group, "opacity", state.cursorOpacity);
        if (!state.active || !element.isConnected) {
          if (time >= endAt(action) || !element.isConnected) restore(element);
          continue;
        }
        // Never blank or replace real text, remove links, or mutate their state.
        if (action.kind !== "frame" && action.kind !== "inspect") {
          touched.add(element);
          element.dataset.constructionTarget = "";
          element.dataset.constructionEffect = action.kind;
          element.style.setProperty("--construction-x", state.x.toFixed(2) + "px");
          element.style.setProperty("--construction-y", state.y.toFixed(2) + "px");
          element.style.setProperty("--construction-scale", String(state.scale));
          element.style.setProperty("--construction-opacity", String(state.opacity));
          if (action.kind === "type" && state.editing && device !== "phone") {
            const edge = Math.floor(state.progress * actor.characters) / actor.characters * 100;
            element.style.setProperty("--construction-mask", "linear-gradient(90deg, #000 " + edge + "%, rgba(0,0,0,.5) " + (edge + 2) + "%)");
          }
          if (action.kind === "style") {
            element.style.setProperty("--construction-border", "color-mix(in srgb, " + actor.border + " " + (35 + state.progress * 65) + "%, transparent)");
          }
        }
        if (device === "phone") continue;
        const x = box.x - viewport.scrollX + state.x;
        const y = box.y - viewport.scrollY + state.y;
        const width = box.width * state.scale;
        const height = box.height * state.scale;
        const bottomVisible = y + height < viewport.height - 30;
        const anchor = anchorFor(action, bottomVisible);
        const targetX = clamp(x + width * anchor[0], 14, viewport.width - 24);
        const targetY = clamp(y + height * anchor[1], viewport.header + 18, viewport.height - 30);
        const cursorX = clamp(targetX + (action.agent % 2 ? -36 : 32) * (1 - state.approach), 8, viewport.width - 24);
        const cursorY = clamp(targetY + 24 * (1 - state.approach), viewport.header + 10, viewport.height - 30);
        set(actor.pointer, "transform", "translate(" + cursorX + " " + cursorY + ")");
        set(actor.arrow, "transform", "scale(" + (1 - .16 * Math.sin(state.click * Math.PI)) + ")");
        set(actor.click, "r", 3 + state.click * 13);
        set(actor.click, "opacity", state.click ? (1 - state.click) * .6 : 0);
        set(actor.tag, "transform", "translate(" + (cursorX > viewport.width - 110 ? -87 : 14) + " " + (cursorY > viewport.height - 62 ? -22 : 25) + ")");
        set(actor.selection, "opacity", state.approach >= 1 ? .8 : 0);
        set(actor.frame, "x", x); set(actor.frame, "y", y);
        set(actor.frame, "width", width); set(actor.frame, "height", height);
        [[x, y], [x + width, y], [x, y + height], [x + width, y + height]].forEach((point, i) => {
          set(actor.handles[i], "x", point[0] - 2.5);
          set(actor.handles[i], "y", point[1] - 2.5);
        });
        const guideY = clamp(y, viewport.header + 8, viewport.height - 8);
        set(actor.guides, "d", "M" + Math.max(8, x - 20) + " " + guideY + "H" + Math.min(viewport.width - 8, x + width + 20) + " M" + x + " " + Math.max(viewport.header + 8, y - 20) + "V" + Math.min(viewport.height - 8, y + height + 20));
        set(actor.guides, "opacity", action.kind === "type" ? .2 : .55);
        set(actor.label, "x", clamp(x, 12, viewport.width - 160));
        set(actor.label, "y", clamp(y - 8, viewport.header + 18, viewport.height - 14));
        set(actor.label, "text", action.kind === "resize" ? Math.round(width) + " × " + Math.round(height) : action.kind === "inspect" ? "ALIGNMENT / CHECK" : action.kind.toUpperCase() + " / " + plan.id.toUpperCase());
        set(actor.check, "transform", "translate(" + clamp(x + width - 10, 15, viewport.width - 18) + " " + clamp(y + 12, viewport.header + 15, viewport.height - 18) + ")");
        set(actor.check, "opacity", action.kind === "inspect" && state.progress > .55 ? 1 : 0);
      }
    },
    finish() { touched.forEach(restore); hide(); },
  };
}

function anchorFor(action: ConstructionAction, bottomVisible: boolean): readonly [number, number] {
  if (action.kind === "resize") return [1, bottomVisible ? 1 : 0];
  if (action.kind === "type") return [.06, .35];
  if (action.kind === "style") return [.88, bottomVisible ? 1 : .1];
  if (action.kind === "inspect") return [.94, .12];
  return [.8, .16];
}
