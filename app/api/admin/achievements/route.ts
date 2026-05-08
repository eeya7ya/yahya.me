import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { asc } from "drizzle-orm";
import { ensureSchema, getDb } from "@/lib/db";
import { achievements } from "@/lib/schema";

export const runtime = "nodejs";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "no_db" }, { status: 500 });
  try {
    await ensureSchema();
    const rows = await db.select().from(achievements).orderBy(asc(achievements.sortOrder));
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: errMsg(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "no_db" }, { status: 500 });
  try {
    await ensureSchema();
  } catch (err) {
    return NextResponse.json({ error: errMsg(err) }, { status: 500 });
  }
  const body = await req.json();
  const row = {
    year: String(body.year ?? ""),
    titleAr: String(body.titleAr ?? ""),
    titleEn: String(body.titleEn ?? ""),
    descAr: String(body.descAr ?? ""),
    descEn: String(body.descEn ?? ""),
    icon: String(body.icon ?? "spark"),
    imageUrl: String(body.imageUrl ?? ""),
    videoUrl: String(body.videoUrl ?? ""),
    media: serializeMedia(body.media),
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
  };
  try {
    const [created] = await db.insert(achievements).values(row).returning();
    revalidatePath("/");
    revalidatePath("/achievements");
    return NextResponse.json(created);
  } catch (err) {
    return NextResponse.json({ error: errMsg(err) }, { status: 500 });
  }
}

function errMsg(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

function serializeMedia(input: unknown): string {
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? JSON.stringify(parsed.map(normalizeMedia).filter(Boolean)) : "[]";
    } catch {
      return "[]";
    }
  }
  if (Array.isArray(input)) {
    return JSON.stringify(input.map(normalizeMedia).filter(Boolean));
  }
  return "[]";
}

function normalizeMedia(m: unknown): { url: string; type: "image" | "video"; caption?: string } | null {
  if (!m || typeof m !== "object") return null;
  const item = m as Record<string, unknown>;
  const url = typeof item.url === "string" ? item.url.trim() : "";
  if (!url) return null;
  const type = item.type === "video" ? "video" : "image";
  const caption = typeof item.caption === "string" && item.caption.trim() ? item.caption : undefined;
  return caption ? { url, type, caption } : { url, type };
}
