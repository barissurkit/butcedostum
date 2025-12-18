import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const password2 = String(body.password2 ?? "");

  // 1) Server-side validation
  if (!email || !password || !password2) {
    return NextResponse.json({ error: "Tüm alanlar zorunlu." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email formatı hatalı." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }
  if (password !== password2) {
    return NextResponse.json({ error: "Şifreler uyuşmuyor." }, { status: 400 });
  }

  // 2) Duplicate check
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Bu email zaten kayıtlı." }, { status: 409 });
  }

  // 3) Hash + create
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, passwordHash } });

  return NextResponse.json({ ok: true });
}
