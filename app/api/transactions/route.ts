/*GET → verileri listele
POST → yeni işlem ekle
PATCH → var olan işlemi güncelle
DELETE → işlemi sil*/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const userId = await getUserIdFromSession();

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/transactions error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    const body = await req.json();

    const title = String(body.title ?? "").trim();
    const amount = Number(body.amount);
    const type = body.type === "income" ? "income" : "expense";
    const date = String(body.date ?? "").trim();
    const category = String(body.category ?? "").trim();

    if (!title) return NextResponse.json({ error: "başlık zorunlu" }, { status: 400 });
    if (!Number.isFinite(amount) || amount === 0)
      return NextResponse.json({ error: "değer sayı olmalı (0 olmasın)" }, { status: 400 });
    if (!date) return NextResponse.json({ error: "tarih zorunlu" }, { status: 400 });

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: Math.trunc(amount),
        type,
        date,
        category: category || null,
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/transactions error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

// body: { id, title?, amount?, type?, date?, category? }
export async function PATCH(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    const body = await req.json();

    const id = String(body.id ?? "").trim();
    if (!id) return NextResponse.json({ error: "id zorunlu" }, { status: 400 });

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data: any = {};

    if (body.title !== undefined) {
      const title = String(body.title ?? "").trim();
      if (!title) return NextResponse.json({ error: "başlık boş olamaz" }, { status: 400 });
      data.title = title;
    }

    if (body.amount !== undefined) {
      const amount = Number(body.amount);
      if (!Number.isFinite(amount) || amount === 0)
        return NextResponse.json({ error: "değer sayı olmalı (0 olmasın)" }, { status: 400 });
      data.amount = Math.trunc(amount);
    }

    if (body.type !== undefined) {
      data.type = body.type === "income" ? "income" : "expense";
    }

    if (body.date !== undefined) {
      const date = String(body.date ?? "").trim();
      if (!date) return NextResponse.json({ error: "tarih boş olamaz" }, { status: 400 });
      data.date = date;
    }

    if (body.category !== undefined) {
      const category = String(body.category ?? "").trim();
      data.category = category ? category : null;
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data,
    });

    return NextResponse.json({ transaction });
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PATCH /api/transactions error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

// body: { id }
export async function DELETE(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    const body = await req.json();

    const id = String(body.id ?? "").trim();
    if (!id) return NextResponse.json({ error: "id zorunlu" }, { status: 400 });

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.transaction.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/transactions error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
