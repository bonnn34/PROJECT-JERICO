/** All pointer, element and guide motion is derived from one scene clock. */
export const AGENTS = [
  { name: "LAYOUT", color: "#97704d" }, { name: "TYPE", color: "#607c74" },
  { name: "NAV", color: "#82708e" }, { name: "UI", color: "#9a8147" },
  { name: "VISUAL", color: "#56768f" }, { name: "STYLE", color: "#a06b6f" },
  { name: "QA", color: "#718358" },
] as const;
export type SectionId = "hero" | "work" | "about" | "expertise" | "experience" | "contact" | "footer";
export type Device = "desktop" | "tablet" | "phone";
export type ActionKind = "frame" | "type" | "place" | "resize" | "style" | "inspect";
export type ConstructionAction = {
  agent: number; target: string; kind: ActionKind; start: number; travel: number;
  pause: number; press: number; duration: number; hold: number; exit: number;
  offset: readonly [number, number];
};
export type SectionPlan = { id: SectionId; trigger: string; duration: number; actions: ConstructionAction[] };
export const action = (agent: number, target: string, kind: ActionKind, start = 0, options: Partial<ConstructionAction> = {}): ConstructionAction =>
  ({ agent, target, kind, start, travel: 750, pause: 180, press: 180, duration: 700, hold: 450, exit: 180, offset: [22, 14], ...options });
export const editAt = (a: ConstructionAction) => a.start + a.travel + a.pause + a.press;
export const endAt = (a: ConstructionAction) => editAt(a) + a.duration + a.hold + a.exit;
export const sequence = (id: SectionId, trigger: string, actions: ConstructionAction[]): SectionPlan => ({ id, trigger, actions, duration: Math.max(...actions.map(endAt)) });
export const SECTION_PLANS: readonly SectionPlan[] = [
  sequence("hero", ".hero-title-viewport", [
    action(0, ".hero-role-block", "frame", 0, { duration: 450 }),
    action(1, ".hero-title", "type", 200, { duration: 850 }),
    action(4, ".hero-media", "place", 650, { duration: 850, offset: [-22, 18] }),
    action(5, ".hero-brand-lockup", "place", 2300, { duration: 650, offset: [12, 8] }),
  ]),
  sequence("work", ":scope", [
    action(0, ":scope", "place", 0, { duration: 800, offset: [-24, 18] }),
    action(4, ".project-visual", "place", 1400, { duration: 750, offset: [18, 14] }),
    action(1, ".project-meta h3", "type", 2400, { duration: 1200 }),
    action(3, ".project-card-tag", "place", 3300, { duration: 600, offset: [0, 10] }),
    action(4, ".project-visual", "resize", 3900, { travel: 700, duration: 600, hold: 400 }),
    action(6, ":scope", "inspect", 5300, { travel: 700, pause: 150, press: 150, duration: 400, hold: 150, exit: 150 }),
  ]),
  sequence("about", ".about-statement", [action(1, ".about-statement h2", "type", 0, { duration: 700 }), action(3, ".about-monogram", "place", 100, { duration: 600, offset: [0, 10] })]),
  sequence("expertise", ".section-masthead", [action(1, "#expertise-heading", "type", 0, { duration: 650 }), action(5, ".expertise-item", "style", 100, { duration: 600 })]),
  sequence("experience", ".experience-title", [action(1, ".experience-entry h3", "type", 0, { duration: 700 }), action(6, ".experience-entry .micro-label", "inspect", 100, { duration: 400 })]),
  sequence("contact", ".contact-heading-wrap", [action(1, "#contact-heading", "type", 0, { duration: 700 }), action(2, ".contact-email", "place", 100, { duration: 600, offset: [0, 8] })]),
  sequence("footer", ".footer-main", [action(2, ".footer-brand-group", "frame", 0, { travel: 400, pause: 150, press: 150, duration: 100, hold: 150, exit: 100 })]),
];
export const deviceFor = (width: number): Device => width <= 600 ? "phone" : width <= 1100 ? "tablet" : "desktop";
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const progressAt = (time: number, start: number, duration: number) => clamp((time - start) / Math.max(1, duration));
export const smooth = (p: number) => p * p * (3 - 2 * p);
export function cardPlan(plan: SectionPlan, index: number, featured: boolean): SectionPlan {
  return { ...plan, actions: plan.actions.map(a => ({
    ...a,
    target: a.agent === 3 && featured ? ".project-proof strong" : a.target,
    offset: a.kind === "place" ? [a.offset[0] * (index % 2 ? -1 : 1), a.offset[1]] : a.offset,
  })) };
}
/** Text length changes edit duration. Re-fit ownership after measuring real text. */
export function scheduleForContent(actions: ConstructionAction[], device: Device, section: SectionId) {
  const limit = device === "phone" ? 1 : device === "tablet" ? 2 : section === "hero" ? 3 : 4;
  const scheduled: ConstructionAction[] = [];
  for (const original of actions) {
    const current = { ...original };
    if (current.kind === "inspect" && section === "work") {
      const builtAt = Math.max(0, ...scheduled.map(a => editAt(a) + a.duration));
      current.start = Math.max(current.start, builtAt - current.travel - current.pause - current.press);
    }
    for (;;) {
      const points = [current.start, ...scheduled.map(a => a.start).filter(t => t > current.start && t < endAt(current))];
      const conflict = points.map(time => scheduled.filter(a => a.start <= time && endAt(a) > time))
        .find(owners => owners.length >= limit || owners.some(a => a.agent === current.agent || a.target === current.target));
      if (!conflict) break;
      current.start = Math.min(...conflict.map(endAt));
    }
    scheduled.push(current);
  }
  return scheduled;
}
export function planFor(plan: SectionPlan, device: Device): SectionPlan {
  if (device === "desktop") return plan;
  if (plan.id === "hero" && device === "phone") {
    const timing = { travel: 500, pause: 150, press: 150, hold: 300, exit: 150 };
    return sequence("hero", plan.trigger, [
      action(1, ".hero-title", "type", 0, { ...timing, duration: 850 }),
      action(4, ".hero-media", "place", 2100, { ...timing, duration: 600, offset: [0, 8] }),
    ]);
  }
  if (plan.id === "work" && device === "phone") {
    const mobile = { travel: 400, pause: 150, press: 150, duration: 500, hold: 200, exit: 100, offset: [0, 8] as const };
    return sequence("work", ":scope", [
      action(0, ":scope", "place", 0, mobile),
      action(4, ".project-visual", "place", 1500, mobile),
      action(1, ".project-meta h3", "type", 3000, { ...mobile, duration: 1600 }),
      action(6, ":scope", "inspect", 5600, { ...mobile, duration: 300 }),
    ]);
  }
  if (plan.id === "work" && device === "tablet") {
    return sequence("work", ":scope", plan.actions.filter(a => a.kind !== "resize").map((a,i) => ({ ...a, start: [0,1100,2550,3900,5500][i] })));
  }
  const actions = plan.actions.filter(a => a.kind !== "frame").slice(0, device === "phone" ? 1 : 2);
  return actions.length ? sequence(plan.id, plan.trigger, actions.map(a => ({ ...a, start: 0, offset: device === "phone" ? [0, 8] : a.offset }))) : plan;
}
export function actionAt(a: ConstructionAction, time: number, device: Device) {
  const edit = editAt(a), done = edit + a.duration;
  const raw = progressAt(time, edit, a.duration);
  const progress = smooth(raw);
  // Pick up only after pressing. Both pointer and element follow this exact lift.
  const lift = raw < .22 ? smooth(raw / .22) : 1 - smooth((raw - .22) / .78);
  const moving = a.kind === "place";
  const clickStart = edit - a.press;
  return {
    active: time >= a.start && time < endAt(a), progress, raw,
    approach: smooth(progressAt(time, a.start, a.travel)), editing: time >= edit,
    selected: time >= clickStart, aligning: time >= done,
    x: moving ? a.offset[0] * lift : 0, y: moving ? a.offset[1] * lift : 0,
    scale: a.kind === "resize" ? 1 - (device === "phone" ? .025 : .065) * lift : 1,
    cursorOpacity: progressAt(time, a.start, 160) * (1 - progressAt(time, done + a.hold, a.exit)),
    click: time >= clickStart && time < edit ? progressAt(time, clickStart, a.press) : 0,
    departure: smooth(progressAt(time, done + a.hold, a.exit)),
  };
}
