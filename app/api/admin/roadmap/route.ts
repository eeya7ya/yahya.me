import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { roadmap } from "@/lib/schema";

export const runtime = "nodejs";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "no_db" }, { status: 500 });
  const rows = await db.select().from(roadmap).orderBy(asc(roadmap.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "no_db" }, { status: 500 });
  const body = await req.json();
  const row = {
    year: String(body.year ?? ""),
    titleAr: String(body.titleAr ?? ""),
    titleEn: String(body.titleEn ?? ""),
    descAr: String(body.descAr ?? ""),
    descEn: String(body.descEn ?? ""),
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
  };
  const [created] = await db.insert(roadmap).values(row).returning();
  revalidatePath("/");
  revalidatePath("/roadmap");
  return NextResponse.json(created);
}
