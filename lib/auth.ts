import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

type SessionPayload = { uid: string; email: string };

export async function getUserIdFromSession(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) throw new Error("UNAUTHORIZED");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("SERVER_MISCONFIG");

  const payload = jwt.verify(token, secret) as SessionPayload;

  if (!payload?.uid) throw new Error("UNAUTHORIZED");
  return payload.uid;
}
