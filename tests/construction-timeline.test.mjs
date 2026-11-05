import assert from "node:assert/strict";
import test from "node:test";
import { AGENTS, SECTION_PLANS, actionAt, deviceFor, editAt, endAt, planFor, scheduleForContent } from "../components/construction/construction-timeline.ts";

test("one owner per cursor and target; responsive density limits", () => {
  assert.equal(AGENTS.length, 7);
  for (const device of ["desktop", "tablet", "phone"]) for (const source of SECTION_PLANS) {
    const plan = planFor(source, device);
    const limit = device === "phone" ? 1 : device === "tablet" ? 2 : plan.id === "hero" ? 3 : 4;
    for (let time = 0; time <= plan.duration; time += 10) {
      const visible = plan.actions.filter(a => actionAt(a, time, device).cursorOpacity > 0);
      assert.ok(visible.length <= limit, device + "/" + plan.id + " at " + time);
      assert.equal(new Set(visible.map(a => a.agent)).size, visible.length);
      assert.equal(new Set(visible.map(a => a.target)).size, visible.length);
    }
    assert.ok(plan.actions.every(a => endAt(a) <= plan.duration));
  }
});

test("approach and pause finish before pressing; construction waits for click", () => {
  for (const plan of SECTION_PLANS) for (const a of plan.actions) {
    assert.ok(a.pause >= 150 && a.press >= 150);
    const pause = a.start + a.travel + a.pause / 2;
    assert.equal(actionAt(a, pause, "desktop").approach, 1);
    assert.equal(actionAt(a, pause, "desktop").click, 0);
    assert.ok(actionAt(a, editAt(a) - a.press / 2, "desktop").click > 0);
    for (let time = a.start; time < editAt(a); time += 15) {
      const state = actionAt(a, time, "desktop");
      assert.equal(Math.abs(state.x), 0); assert.equal(Math.abs(state.y), 0);
      assert.equal(state.scale, 1); assert.equal(state.editing, false);
    }
  }
});

test("motion is continuous and settles to unchanged geometry", () => {
  for (const plan of SECTION_PLANS) for (const a of plan.actions) {
    for (const time of [a.start, a.start + a.travel, editAt(a), editAt(a) + a.duration * .22, editAt(a) + a.duration, endAt(a)]) {
      const before = actionAt(a, time - .001, "desktop"), after = actionAt(a, time + .001, "desktop");
      for (const key of ["x", "y", "scale", "approach", "cursorOpacity"]) assert.ok(Math.abs(before[key] - after[key]) < .002, key);
    }
    const final = actionAt(a, endAt(a), "desktop");
    assert.equal(Math.abs(final.x), 0); assert.equal(Math.abs(final.y), 0);
    assert.equal(final.scale, 1); assert.equal(final.cursorOpacity, 0);
  }
});

test("phone sequences have a real cursor; plans are deterministic", () => {
  const snapshot = structuredClone(SECTION_PLANS);
  for (const source of SECTION_PLANS) {
    const plan = planFor(source, "phone");
    assert.ok(plan.actions.some(a => actionAt(a, a.start + 200, "phone").cursorOpacity > 0));
    planFor(source, "tablet");
    assert.deepEqual(actionAt(source.actions[0], 1300, "desktop"), actionAt(source.actions[0], 1300, "desktop"));
  }
  assert.deepEqual(SECTION_PLANS, snapshot);
  assert.equal(deviceFor(480), "phone"); assert.equal(deviceFor(768), "tablet"); assert.equal(deviceFor(1440), "desktop");
});

test("long real titles preserve mobile ownership and keep QA after edits", () => {
  for (const device of ["phone", "tablet", "desktop"]) {
    const plan = planFor(SECTION_PLANS.find(p => p.id === "work"), device);
    const actions = scheduleForContent(plan.actions.map(a => ({ ...a, duration: a.kind === "type" ? 48 * 38 : a.duration })), device, "work");
    const limit = device === "phone" ? 1 : device === "tablet" ? 2 : 4;
    for (let time = 0; time < Math.max(...actions.map(endAt)); time += 10) assert.ok(actions.filter(a => time >= a.start && time < endAt(a)).length <= limit);
    const qa = actions.find(a => a.kind === "inspect");
    assert.ok(editAt(qa) >= Math.max(...actions.filter(a => a.kind !== "inspect").map(a => editAt(a) + a.duration)));
  }
});
