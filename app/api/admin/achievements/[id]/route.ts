import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { achievements } from "@/lib/schema";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "no_db" }, { status: 500 });
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) return NextResponse.json({ error: "bad_id" }, { status: 400 });

  const body = await req.json();
  const updates = {
    year: String(body.year ?? ""),
    titleAr: String(body.titleAr ?? ""),
    titleEn: String(body.titleEn ?? ""),
    descAr: String(body.descAr ?? ""),
    descEn: String(body.descEn ?? ""),
    icon: String(body.icon ?? "spark"),
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
  };
  const [updated] = await db.update(achievements).set(updates).where(eq(achievements.id, numId)).returning();
  revalidatePath("/");
  revalidatePath("/achievements");
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "no_db" }, { status: 500 });
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) return NextResponse.json({ error: "bad_id" }, { status: 400 });
  await db.delete(achievements).where(eq(achievements.id, numId));
  revalidatePath("/");
  revalidatePath("/achievements");
  return NextResponse.json({ ok: true });
}
