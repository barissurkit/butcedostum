import test from "node:test";
import assert from "node:assert/strict";

import { txStore } from "../server/transactionsStore.ts";

test("store is seeded with four transactions", () => {
  assert.equal(txStore.transactions.length, 4);
});

test("seeded transactions have unique ids and valid types", () => {
  const ids = txStore.transactions.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const t of txStore.transactions) {
    assert.ok(t.type === "income" || t.type === "expense");
    assert.ok(Number.isFinite(t.amount) && t.amount > 0);
    assert.match(t.date, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("store is shared through globalThis (singleton)", () => {
  assert.equal(globalThis.__txStore, txStore);
});

test("seed contains both income and expense records", () => {
  const types = new Set(txStore.transactions.map((t) => t.type));
  assert.deepEqual([...types].sort(), ["expense", "income"]);
});
