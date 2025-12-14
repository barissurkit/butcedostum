import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TransactionType } from "@/types/transaction";

export const runtime = "nodejs";

function isTransactionType(x: unknown): x is TransactionType {
  return x === "income" || x === "expense";
}

function parseAmount(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;

  // Şemada amount Int olduğu için tam sayı bekliyoruz.
  // (Şimdilik kuruşla uğraşmıyoruz, TL bazında düşün.)
  const int = Math.round(n);
  if (int <= 0) return null;

  return int;
}

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ transactions });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const type = body?.type;
  const amount = parseAmount(body?.amount);
  const date = typeof body?.date === "string" ? body.date : "";

  if (!title) return NextResponse.json({ error: "Başlık boş olamaz." }, { status: 400 });
  if (!isTransactionType(type)) return NextResponse.json({ error: "Tür geçersiz." }, { status: 400 });
  if (amount === null) return NextResponse.json({ error: "Tutar geçersiz." }, { status: 400 });
  if (!date) return NextResponse.json({ error: "Tarih boş olamaz." }, { status: 400 });

  const created = await prisma.transaction.create({
    data: {
      title,
      type,
      amount,
      date,
    },
  });

  return NextResponse.json({ transaction: created }, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id zorunlu." }, { status: 400 });

  try {
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "İşlem bulunamadı." }, { status: 404 });
  }
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id zorunlu." }, { status: 400 });

  const body = await req.json().catch(() => null);

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const type = body?.type;
  const amount = parseAmount(body?.amount);
  const date = typeof body?.date === "string" ? body.date : "";

  if (!title) return NextResponse.json({ error: "Başlık boş olamaz." }, { status: 400 });
  if (!isTransactionType(type)) return NextResponse.json({ error: "Tür geçersiz." }, { status: 400 });
  if (amount === null) return NextResponse.json({ error: "Tutar geçersiz." }, { status: 400 });
  if (!date) return NextResponse.json({ error: "Tarih boş olamaz." }, { status: 400 });

  try {
    const updated = await prisma.transaction.update({
      where: { id },
      data: { title, type, amount, date },
    });

    return NextResponse.json({ transaction: updated });
  } catch {
    return NextResponse.json({ error: "İşlem bulunamadı." }, { status: 404 });
  }
}
