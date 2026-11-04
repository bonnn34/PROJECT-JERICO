/** Deterministic choreography for the real DOM. Start includes the approach;
 * the edit begins after travel. No random paths or independent clocks. */
export const AGENTS = [
  { name: "LAYOUT", color: "#97704d" },
  { name: "TYPE", color: "#607c74" },
  { name: "NAV", color: "#82708e" },
  { name: "UI", color: "#9a8147" },
  { name: "VISUAL", color: "#56768f" },
  { name: "STYLE", color: "#a06b6f" },
  { name: "QA", color: "#718358" },
] as const;

export type SectionId = "hero" | "work" | "about" | "expertise" | "experience" | "contact" | "footer";
export type Device = "desktop" | "tablet" | "phone";
export type ActionKind = "frame" | "type" | "place" | "resize" | "style" | "inspect";
export type ConstructionAction = {
  agent: number;
  target: string;
  kind: ActionKind;
  start: number;
  travel: number;
  duration: number;
  offset: readonly [number, number];
};
export type SectionPlan = {
  id: SectionId;
  trigger: string;
  duration: number;
  actions: ConstructionAction[];
};

const action = (agent: number, target: string, kind: ActionKind, start: number, travel = 350, duration = 400, offset: readonly [number, number] = [12, 8]): ConstructionAction =>
  ({ agent, target, kind, start, travel, duration, offset });

export const SECTION_PLANS: readonly SectionPlan[] = [
  { id: "hero", trigger: ".hero-title-viewport", duration: 2100, actions: [
    action(0, ".hero-role-block", "frame", 0, 230, 240),
    action(1, ".hero-title-viewport", "type", 80, 350, 460),
    action(4, ".hero-media", "place", 260, 350, 450, [-16, 10]),
    action(5, ".hero-brand-lockup", "place", 1100, 280, 350, [10, 0]),
    action(6, ".hero-bottom-rail", "inspect", 1500, 200, 220),
  ] },
  { id: "work", trigger: ".projects-grid", duration: 2400, actions: [
    action(0, ".project-card", "frame", 0, 260, 230),
    action(4, ".project-card:first-child .project-visual", "place", 100, 360, 440, [-18, 12]),
    action(1, ".project-card:nth-child(2) .project-meta", "type", 200, 350, 450),
    action(3, ".project-card:nth-child(2) .project-visual", "resize", 400, 320, 450),
    action(5, ".project-card:first-child", "style", 1200, 260, 350),
    action(6, ".project-card:first-child .project-visual", "inspect", 1750, 200, 260),
  ] },
  { id: "about", trigger: ".about-statement", duration: 1450, actions: [
    action(1, ".about-statement h2", "type", 0, 300, 380),
    action(3, ".about-monogram", "place", 180, 320, 360, [0, 8]),
    action(0, ".about-details", "inspect", 900, 180, 200),
  ] },
  { id: "expertise", trigger: ".section-masthead", duration: 1350, actions: [
    action(1, "#expertise-heading", "type", 0, 300, 350),
    action(5, ".expertise-item", "style", 160, 320, 340),
    action(0, ".skill-tags", "inspect", 840, 170, 180),
  ] },
  { id: "experience", trigger: ".experience-title", duration: 1350, actions: [
    action(1, ".experience-entry h3", "type", 0, 320, 350),
    action(5, ".experience-entry", "style", 160, 300, 350),
    action(6, ".experience-list", "inspect", 850, 160, 180),
  ] },
  { id: "contact", trigger: ".contact-heading-wrap", duration: 1500, actions: [
    action(1, "#contact-heading", "type", 0, 300, 360),
    action(3, ".contact-email", "place", 160, 320, 320, [0, 5]),
    action(2, ".socials", "type", 850, 220, 260),
  ] },
  { id: "footer", trigger: ".footer-main", duration: 850, actions: [
    action(2, ".footer-brand-group", "place", 0, 300, 350, [0, 5]),
  ] },
];

export const deviceFor = (width: number): Device => width <= 600 ? "phone" : width <= 1100 ? "tablet" : "desktop";
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const progressAt = (time: number, start: number, duration: number) => clamp((time - start) / duration);
export const smooth = (p: number) => p * p * (3 - 2 * p);
export const endAt = (a: ConstructionAction) => a.start + a.travel + a.duration + 160;

export function planFor(plan: SectionPlan, device: Device): SectionPlan {
  if (device === "desktop") return plan;
  if (device === "phone") {
    // No simulated pointer, drag, or resize on phones. Real content stays legible.
    const simple = plan.actions.filter(a => a.kind === "type" || a.kind === "place").slice(0, 2);
    return { ...plan, duration: 550, actions: simple.map((a, i) => ({ ...a, kind: "place", start: i * 60, travel: 0, duration: 300, offset: [0, 0] })) };
  }
  if (plan.id === "hero" || plan.id === "work") {
    const selected = plan.actions.filter(a => a.agent === 1 || a.agent === 4 || a.agent === 6);
    return { ...plan, duration: 1800, actions: selected.map((a, i) => ({ ...a, start: i < 2 ? i * 140 : 1120, travel: i < 2 ? 300 : 180, duration: i < 2 ? 380 : 200 })) };
  }
  return plan;
}

export function actionAt(action: ConstructionAction, time: number, device: Device) {
  const editStart = action.start + action.travel;
  const progress = smooth(progressAt(time, editStart, action.duration));
  const pickup = smooth(progressAt(time, action.start, Math.min(140, action.travel || 140)));
  const amount = pickup * (1 - progress);
  const active = time >= action.start && time < endAt(action);
  const fade = progressAt(time, action.start, 120) * (1 - progressAt(time, editStart + action.duration, 160));
  const isMoving = action.kind === "place";
  return {
    active, progress,
    approach: smooth(progressAt(time, action.start, Math.max(1, action.travel - 80))),
    editing: time >= editStart,
    opacity: device === "phone" ? 1 - .16 * amount : 1 - (isMoving ? .45 : .2) * amount,
    x: device === "phone" || !isMoving ? 0 : action.offset[0] * amount,
    y: device === "phone" || !isMoving ? 0 : action.offset[1] * amount,
    scale: device !== "phone" && action.kind === "resize" ? 1 - .045 * amount : 1,
    cursorOpacity: device === "phone" ? 0 : active ? fade : 0,
    click: time >= editStart && time < editStart + 220 ? progressAt(time, editStart, 220) : 0,
  };
}
