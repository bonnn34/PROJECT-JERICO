import assert from "node:assert/strict";
import test from "node:test";
import { AGENTS, SECTION_PLANS, actionAt, deviceFor, endAt, planFor } from "../components/construction/construction-timeline.ts";

// Node 22.6+. Omitting --test also works in shells that disallow child processes.
test("all seven identities have work and section density stays within the brief", () => {
  assert.equal(AGENTS.length, 7);
  assert.equal(new Set(SECTION_PLANS.flatMap(p => p.actions.map(a => a.agent))).size, 7);
  for (const device of ["desktop", "tablet", "phone"]) {
    for (const original of SECTION_PLANS) {
      const plan = planFor(original, device);
      const limit = device === "phone" ? 0 : device === "tablet" ? 2 : plan.id === "work" ? 4 : plan.id === "hero" ? 3 : plan.id === "footer" ? 1 : 2;
      let maximum = 0;
      for (let time = 0; time <= plan.duration; time += 10) {
        const visible = plan.actions.filter(a => actionAt(a, time, device).cursorOpacity > 0);
        assert.equal(new Set(visible.map(a => a.agent)).size, visible.length, "no agent has competing assignments");
        maximum = Math.max(maximum, visible.length);
        assert.ok(visible.length <= limit, device + " / " + plan.id + " at " + time);
      }
      if (device === "desktop" && ["hero", "work"].includes(plan.id)) assert.equal(maximum, limit);
      assert.ok(plan.actions.every(a => endAt(a) <= plan.duration), plan.id + " finishes all actions");
    }
  }
});

test("phone construction never drags, resizes, masks text, or shows cursors", () => {
  for (const source of SECTION_PLANS) {
    const plan = planFor(source, "phone");
    assert.ok(plan.duration <= 600);
    for (const action of plan.actions) {
      assert.equal(action.kind, "place");
      for (let time = 0; time <= plan.duration; time += 10) {
        const frame = actionAt(action, time, "phone");
        assert.equal(frame.cursorOpacity, 0);
        assert.equal(frame.scale, 1);
        assert.equal(frame.x, 0); assert.equal(frame.y, 0);
        assert.ok(frame.opacity >= .84);
      }
    }
  }
});

test("components and cursors settle continuously without changing final geometry", () => {
  for (const plan of SECTION_PLANS) for (const action of plan.actions) {
    const boundaries = [action.start, action.start + action.travel - 80, action.start + action.travel, endAt(action) - 160, endAt(action)];
    for (const time of boundaries) {
      const a = actionAt(action, time - .01, "desktop"), b = actionAt(action, time + .01, "desktop");
      for (const key of ["x", "y", "scale", "opacity", "approach", "cursorOpacity"]) {
        assert.ok(Math.abs(a[key] - b[key]) < .002, plan.id + " " + action.kind + " " + key);
      }
    }
    const final = actionAt(action, plan.duration, "desktop");
    assert.equal(Math.abs(final.x), 0); assert.equal(Math.abs(final.y), 0);
    assert.equal(final.opacity, 1); assert.equal(final.scale, 1); assert.equal(final.cursorOpacity, 0);
  }
});

test("agents pause before committing and click feedback shares the edit clock", () => {
  for (const plan of SECTION_PLANS) for (const action of plan.actions) {
    const clickAt = action.start + action.travel;
    assert.equal(actionAt(action, clickAt - 40, "desktop").approach, 1);
    assert.equal(actionAt(action, clickAt - 1, "desktop").editing, false);
    assert.equal(actionAt(action, clickAt - 1, "desktop").click, 0);
    assert.ok(actionAt(action, clickAt + 70, "desktop").click > 0);
    assert.ok(actionAt(action, clickAt + action.duration / 2, "desktop").progress > 0);
  }
});

test("evaluation is deterministic and device plans do not mutate source choreography", () => {
  const snapshot = structuredClone(SECTION_PLANS);
  for (const source of SECTION_PLANS) {
    const frames = source.actions.map(a => actionAt(a, 500, "desktop"));
    planFor(source, "phone"); planFor(source, "tablet");
    source.actions.forEach(a => actionAt(a, 1800, "desktop"));
    assert.deepEqual(source.actions.map(a => actionAt(a, 500, "desktop")), frames);
  }
  assert.deepEqual(SECTION_PLANS, snapshot);
  assert.equal(deviceFor(320), "phone"); assert.equal(deviceFor(600), "phone");
  assert.equal(deviceFor(768), "tablet"); assert.equal(deviceFor(1024), "tablet");
  assert.equal(deviceFor(1440), "desktop"); assert.equal(deviceFor(1920), "desktop");
});
