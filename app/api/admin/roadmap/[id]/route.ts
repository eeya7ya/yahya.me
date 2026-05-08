import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { roadmap } from "@/lib/schema";

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
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
  };
  const [updated] = await db.update(roadmap).set(updates).where(eq(roadmap.id, numId)).returning();
  revalidatePath("/");
  revalidatePath("/roadmap");
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "no_db" }, { status: 500 });
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) return NextResponse.json({ error: "bad_id" }, { status: 400 });
  await db.delete(roadmap).where(eq(roadmap.id, numId));
  revalidatePath("/");
  revalidatePath("/roadmap");
  return NextResponse.json({ ok: true });
}
