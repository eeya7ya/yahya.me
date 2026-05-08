import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { saveContent, type SettingKey, SETTING_KEYS } from "@/lib/settings";

export const runtime = "nodejs";

const validKeys = new Set<string>(SETTING_KEYS.map(([k]) => k));

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "bad_body" }, { status: 400 });
  }
  const updates: Partial<Record<SettingKey, string>> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!validKeys.has(k)) continue;
    if (typeof v !== "string") continue;
    updates[k as SettingKey] = v;
  }
  try {
    await saveContent(updates);
  } catch (err) {
    return NextResponse.json({ error: String(err instanceof Error ? err.message : err) }, { status: 500 });
  }
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/roadmap");
  revalidatePath("/achievements");
  revalidatePath("/contact");
  return NextResponse.json({ ok: true });
}
