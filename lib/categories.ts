// lib/categories.ts

export const EXPENSE_CATEGORIES = [
  "Market",
  "Kira",
  "Faturalar",
  "Ulaşım",
  "Yemek",
  "Eğlence",
  "Sağlık",
  "Eğitim",
  "Giyim",
  "Diğer",
] as const;

export const INCOME_CATEGORIES = [
  "Maaş",
  "Harçlık",
  "Freelance",
  "Satış",
  "Burs",
  "Diğer",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type Category = ExpenseCategory | IncomeCategory;

export function getCategoriesByType(type: "income" | "expense") {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
