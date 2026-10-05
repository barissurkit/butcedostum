import test from "node:test";
import assert from "node:assert/strict";

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoriesByType,
} from "../lib/categories.ts";

test("getCategoriesByType returns income categories for income", () => {
  assert.equal(getCategoriesByType("income"), INCOME_CATEGORIES);
});

test("getCategoriesByType returns expense categories for expense", () => {
  assert.equal(getCategoriesByType("expense"), EXPENSE_CATEGORIES);
});

test("income categories contain the expected entries", () => {
  assert.deepEqual([...INCOME_CATEGORIES], ["Maaş", "Harçlık", "Freelance", "Satış", "Burs", "Diğer"]);
});

test("expense categories contain the expected entries", () => {
  assert.deepEqual(
    [...EXPENSE_CATEGORIES],
    ["Market", "Kira", "Faturalar", "Ulaşım", "Yemek", "Eğlence", "Sağlık", "Eğitim", "Giyim", "Diğer"],
  );
});

test("category lists have no duplicates and both offer a fallback category", () => {
  for (const list of [INCOME_CATEGORIES, EXPENSE_CATEGORIES]) {
    assert.equal(new Set(list).size, list.length);
    assert.ok(list.includes("Diğer"));
  }
});
