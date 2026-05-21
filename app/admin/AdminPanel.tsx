"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { RoadmapRow, AchievementRow, ProjectRow } from "@/lib/schema";
import { contentToFlat, type SiteContent } from "@/lib/settings";

type Props = {
  content: SiteContent;
  roadmap: RoadmapRow[];
  achievements: AchievementRow[];
  projects: ProjectRow[];
  dbConnected: boolean;
};

type Tab = "content" | "roadmap" | "achievements" | "projects";

const ICON_OPTIONS = ["spark", "trophy", "bolt", "sun"] as const;

type MediaItem = SiteContent["about"]["media"][number];

function parseMediaField(raw: string | undefined | null): MediaItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((m) => m && typeof m.url === "string" && m.url.length > 0)
      .map((m) => ({
        url: String(m.url),
        type:
          /\.pdf(\?|#|$)/i.test(String(m.url)) ? "pdf" :
          m.type === "video" ? "video" :
          m.type === "pdf" ? "pdf" :
          "image",
        caption: typeof m.caption === "string" ? m.caption : undefined,
        thumbUrl: typeof m.thumbUrl === "string" && m.thumbUrl ? m.thumbUrl : undefined,
      })) as MediaItem[];
  } catch {
    return [];
  }
}

function achievementMediaItems(row: { media?: string; imageUrl?: string; videoUrl?: string }): MediaItem[] {
  const fromMedia = parseMediaField(row.media);
  if (fromMedia.length > 0) return fromMedia;
  const legacy: MediaItem[] = [];
  if (row.videoUrl) legacy.push({ url: row.videoUrl, type: "video" });
  if (row.imageUrl) legacy.push({ url: row.imageUrl, type: "image" });
  return legacy;
}

export default function AdminPanel({ content, roadmap, achievements, projects, dbConnected }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("content");
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen sunglow">
      <header className="sticky top-0 z-30 backdrop-blur bg-[var(--color-cream)]/75 border-b border-[var(--color-orange-300)]/30">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-[var(--color-ink)]/80 hover:text-[var(--color-orange-600)]">
              ← Site
            </Link>
            <h1 className="text-lg font-bold">Admin</h1>
            {!dbConnected && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                DB not connected — changes won&apos;t persist
              </span>
            )}
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 hover:bg-[var(--color-orange-50)]"
          >
            Sign out
          </button>
        </div>

        <nav className="max-w-6xl mx-auto px-6 md:px-10 pb-3 flex items-center gap-2">
          {(["content", "roadmap", "achievements", "projects"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs transition ${
                tab === t
                  ? "bg-[var(--color-orange-500)] text-white"
                  : "border border-[var(--color-orange-300)]/60 text-[var(--color-ink-soft)] hover:text-[var(--color-orange-600)]"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        {tab === "content" && (
          <ContentEditor
            content={content}
            busy={busy}
            setBusy={setBusy}
            flash={flash}
            refresh={() => startTransition(() => router.refresh())}
          />
        )}
        {tab === "roadmap" && (
          <RoadmapEditor items={roadmap} busy={busy} setBusy={setBusy} flash={flash} refresh={() => startTransition(() => router.refresh())} />
        )}
        {tab === "achievements" && (
          <AchievementsEditor items={achievements} busy={busy} setBusy={setBusy} flash={flash} refresh={() => startTransition(() => router.refresh())} />
        )}
        {tab === "projects" && (
          <ProjectsEditor items={projects} busy={busy} setBusy={setBusy} flash={flash} refresh={() => startTransition(() => router.refresh())} />
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-full bg-[var(--color-ink)] text-white text-xs px-4 py-2 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------- Content editor ---------------- */

function ContentEditor({
  content,
  busy,
  setBusy,
  flash,
  refresh,
}: {
  content: SiteContent;
  busy: boolean;
  setBusy: (v: boolean) => void;
  flash: (msg: string) => void;
  refresh: () => void;
}) {
  const [draft, setDraft] = useState<SiteContent>(content);

  function patch<K extends keyof SiteContent>(group: K, value: SiteContent[K]) {
    setDraft((d) => ({ ...d, [group]: value }));
  }

  async function save() {
    setBusy(true);
    try {
      const flat = contentToFlat(draft);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(flat),
      });
      if (!res.ok) throw new Error(await readError(res));
      flash("Saved");
      refresh();
    } catch (e) {
      flash(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <Section title="Photo">
        <Field label="Photo URL" value={draft.photoUrl} onChange={(v) => setDraft({ ...draft, photoUrl: v })} />
        {draft.photoUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={draft.photoUrl} alt="preview" className="mt-2 h-32 w-32 object-cover rounded-xl border border-[var(--color-orange-300)]/40" />
        )}
      </Section>

      <Section title="Hero">
        <Bilingual
          labelAr="Greeting (AR)" valueAr={draft.hero.greetingAr} onChangeAr={(v) => patch("hero", { ...draft.hero, greetingAr: v })}
          labelEn="Greeting (EN)" valueEn={draft.hero.greetingEn} onChangeEn={(v) => patch("hero", { ...draft.hero, greetingEn: v })}
        />
        <Bilingual
          labelAr="Name (AR)" valueAr={draft.hero.nameAr} onChangeAr={(v) => patch("hero", { ...draft.hero, nameAr: v })}
          labelEn="Name (EN)" valueEn={draft.hero.nameEn} onChangeEn={(v) => patch("hero", { ...draft.hero, nameEn: v })}
        />
        <Bilingual
          labelAr="Role (AR)" valueAr={draft.hero.roleAr} onChangeAr={(v) => patch("hero", { ...draft.hero, roleAr: v })}
          labelEn="Role (EN)" valueEn={draft.hero.roleEn} onChangeEn={(v) => patch("hero", { ...draft.hero, roleEn: v })}
        />
        <Bilingual
          labelAr="Tagline (AR)" valueAr={draft.hero.taglineAr} onChangeAr={(v) => patch("hero", { ...draft.hero, taglineAr: v })}
          labelEn="Tagline (EN)" valueEn={draft.hero.taglineEn} onChangeEn={(v) => patch("hero", { ...draft.hero, taglineEn: v })}
        />
        <Bilingual
          labelAr="CTA (AR)" valueAr={draft.hero.ctaAr} onChangeAr={(v) => patch("hero", { ...draft.hero, ctaAr: v })}
          labelEn="CTA (EN)" valueEn={draft.hero.ctaEn} onChangeEn={(v) => patch("hero", { ...draft.hero, ctaEn: v })}
        />
      </Section>

      <Section title="About">
        <Bilingual
          labelAr="Title (AR)" valueAr={draft.about.titleAr} onChangeAr={(v) => patch("about", { ...draft.about, titleAr: v })}
          labelEn="Title (EN)" valueEn={draft.about.titleEn} onChangeEn={(v) => patch("about", { ...draft.about, titleEn: v })}
        />
        <BilingualTextarea
          labelAr="Body (AR)" valueAr={draft.about.bodyAr} onChangeAr={(v) => patch("about", { ...draft.about, bodyAr: v })}
          labelEn="Body (EN)" valueEn={draft.about.bodyEn} onChangeEn={(v) => patch("about", { ...draft.about, bodyEn: v })}
        />
        <Bilingual
          labelAr="Values (AR, comma-sep)" valueAr={draft.about.valuesAr.join(", ")}
          onChangeAr={(v) => patch("about", { ...draft.about, valuesAr: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          labelEn="Values (EN, comma-sep)" valueEn={draft.about.valuesEn.join(", ")}
          onChangeEn={(v) => patch("about", { ...draft.about, valuesEn: v.split(",").map((s) => s.trim()).filter(Boolean) })}
        />
        <MediaGallery
          items={draft.about.media}
          onChange={(media) => patch("about", { ...draft.about, media })}
          flash={flash}
        />
      </Section>

      <Section title="Roadmap headers">
        <Bilingual
          labelAr="Title (AR)" valueAr={draft.roadmap.titleAr} onChangeAr={(v) => patch("roadmap", { ...draft.roadmap, titleAr: v })}
          labelEn="Title (EN)" valueEn={draft.roadmap.titleEn} onChangeEn={(v) => patch("roadmap", { ...draft.roadmap, titleEn: v })}
        />
        <Bilingual
          labelAr="Subtitle (AR)" valueAr={draft.roadmap.subtitleAr} onChangeAr={(v) => patch("roadmap", { ...draft.roadmap, subtitleAr: v })}
          labelEn="Subtitle (EN)" valueEn={draft.roadmap.subtitleEn} onChangeEn={(v) => patch("roadmap", { ...draft.roadmap, subtitleEn: v })}
        />
      </Section>

      <Section title="Achievements headers">
        <Bilingual
          labelAr="Title (AR)" valueAr={draft.achievements.titleAr} onChangeAr={(v) => patch("achievements", { ...draft.achievements, titleAr: v })}
          labelEn="Title (EN)" valueEn={draft.achievements.titleEn} onChangeEn={(v) => patch("achievements", { ...draft.achievements, titleEn: v })}
        />
        <Bilingual
          labelAr="Subtitle (AR)" valueAr={draft.achievements.subtitleAr} onChangeAr={(v) => patch("achievements", { ...draft.achievements, subtitleAr: v })}
          labelEn="Subtitle (EN)" valueEn={draft.achievements.subtitleEn} onChangeEn={(v) => patch("achievements", { ...draft.achievements, subtitleEn: v })}
        />
      </Section>

      <Section title="Projects headers">
        <Bilingual
          labelAr="Title (AR)" valueAr={draft.projects.titleAr} onChangeAr={(v) => patch("projects", { ...draft.projects, titleAr: v })}
          labelEn="Title (EN)" valueEn={draft.projects.titleEn} onChangeEn={(v) => patch("projects", { ...draft.projects, titleEn: v })}
        />
        <Bilingual
          labelAr="Subtitle (AR)" valueAr={draft.projects.subtitleAr} onChangeAr={(v) => patch("projects", { ...draft.projects, subtitleAr: v })}
          labelEn="Subtitle (EN)" valueEn={draft.projects.subtitleEn} onChangeEn={(v) => patch("projects", { ...draft.projects, subtitleEn: v })}
        />
      </Section>

      <Section title="Contact">
        <Bilingual
          labelAr="Title (AR)" valueAr={draft.contact.titleAr} onChangeAr={(v) => patch("contact", { ...draft.contact, titleAr: v })}
          labelEn="Title (EN)" valueEn={draft.contact.titleEn} onChangeEn={(v) => patch("contact", { ...draft.contact, titleEn: v })}
        />
        <Bilingual
          labelAr="Subtitle (AR)" valueAr={draft.contact.subtitleAr} onChangeAr={(v) => patch("contact", { ...draft.contact, subtitleAr: v })}
          labelEn="Subtitle (EN)" valueEn={draft.contact.subtitleEn} onChangeEn={(v) => patch("contact", { ...draft.contact, subtitleEn: v })}
        />
        <Field label="Email" value={draft.contact.email} onChange={(v) => patch("contact", { ...draft.contact, email: v })} />
        <Field label="Website URL" value={draft.contact.website} onChange={(v) => patch("contact", { ...draft.contact, website: v })} />
        <Field label="GitHub URL" value={draft.contact.github} onChange={(v) => patch("contact", { ...draft.contact, github: v })} />
        <Field label="LinkedIn URL" value={draft.contact.linkedin} onChange={(v) => patch("contact", { ...draft.contact, linkedin: v })} />
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-full bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 shadow-lg transition"
        >
          {busy ? "Saving..." : "Save all"}
        </button>
      </div>
    </div>
  );
}

async function readError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text);
    if (j && typeof j.error === "string") return j.error;
  } catch {}
  return text || `HTTP ${res.status}`;
}

/* ---------------- Roadmap editor ---------------- */

type EditorRow<T> = T & { _isNew?: boolean; _dirty?: boolean };

function RoadmapEditor({
  items,
  busy,
  setBusy,
  flash,
  refresh,
}: {
  items: RoadmapRow[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  flash: (msg: string) => void;
  refresh: () => void;
}) {
  const [rows, setRows] = useState<EditorRow<RoadmapRow>[]>(items);

  function update(id: number, patch: Partial<RoadmapRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch, _dirty: true } : r)));
  }

  function addRow() {
    const tempId = -Date.now();
    setRows((rs) => [
      ...rs,
      {
        id: tempId, year: "", titleAr: "", titleEn: "", descAr: "", descEn: "",
        sortOrder: rs.length + 1, _isNew: true, _dirty: true,
      },
    ]);
  }

  async function saveRow(row: EditorRow<RoadmapRow>) {
    setBusy(true);
    try {
      const payload = {
        year: row.year, titleAr: row.titleAr, titleEn: row.titleEn,
        descAr: row.descAr, descEn: row.descEn, sortOrder: row.sortOrder,
      };
      if (row._isNew) {
        const res = await fetch("/api/admin/roadmap", {
          method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await readError(res));
      } else {
        const res = await fetch(`/api/admin/roadmap/${row.id}`, {
          method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await readError(res));
      }
      flash("Saved");
      refresh();
    } catch (e) {
      console.error(e);
      flash(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function deleteRow(row: EditorRow<RoadmapRow>) {
    if (row._isNew) {
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      return;
    }
    if (!confirm("Delete this entry?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/roadmap/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await readError(res));
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      flash("Deleted");
      refresh();
    } catch (e) {
      console.error(e);
      flash(`Delete failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Roadmap entries</h2>
        <button onClick={addRow} className="rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 px-3 py-1.5 text-xs hover:bg-[var(--color-orange-50)]">
          + Add entry
        </button>
      </div>
      {rows.map((row) => (
        <div key={row.id} className="rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/70 p-5 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Year" value={row.year} onChange={(v) => update(row.id, { year: v })} />
            <Field label="Sort" type="number" value={String(row.sortOrder)} onChange={(v) => update(row.id, { sortOrder: Number(v) || 0 })} />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Title (AR)" value={row.titleAr} onChange={(v) => update(row.id, { titleAr: v })} />
            <Field label="Title (EN)" value={row.titleEn} onChange={(v) => update(row.id, { titleEn: v })} />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <TextareaField label="Desc (AR)" value={row.descAr} onChange={(v) => update(row.id, { descAr: v })} />
            <TextareaField label="Desc (EN)" value={row.descEn} onChange={(v) => update(row.id, { descEn: v })} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => deleteRow(row)} disabled={busy} className="text-xs px-3 py-1.5 rounded-full border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60">
              Delete
            </button>
            <button onClick={() => saveRow(row)} disabled={busy} className="text-xs px-4 py-1.5 rounded-full bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white disabled:opacity-60">
              {row._isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Achievements editor ---------------- */

function AchievementsEditor({
  items,
  busy,
  setBusy,
  flash,
  refresh,
}: {
  items: AchievementRow[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  flash: (msg: string) => void;
  refresh: () => void;
}) {
  const [rows, setRows] = useState<EditorRow<AchievementRow>[]>(items);

  function update(id: number, patch: Partial<AchievementRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch, _dirty: true } : r)));
  }

  function addRow() {
    const tempId = -Date.now();
    setRows((rs) => [
      ...rs,
      {
        id: tempId, year: "", titleAr: "", titleEn: "", descAr: "", descEn: "",
        icon: "spark", imageUrl: "", videoUrl: "", media: "[]",
        sortOrder: rs.length + 1, _isNew: true, _dirty: true,
      },
    ]);
  }

  async function saveRow(row: EditorRow<AchievementRow>) {
    setBusy(true);
    try {
      const payload = {
        year: row.year, titleAr: row.titleAr, titleEn: row.titleEn,
        descAr: row.descAr, descEn: row.descEn, icon: row.icon,
        imageUrl: row.imageUrl, videoUrl: row.videoUrl,
        media: parseMediaField(row.media),
        sortOrder: row.sortOrder,
      };
      if (row._isNew) {
        const res = await fetch("/api/admin/achievements", {
          method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await readError(res));
      } else {
        const res = await fetch(`/api/admin/achievements/${row.id}`, {
          method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await readError(res));
      }
      flash("Saved");
      refresh();
    } catch (e) {
      console.error(e);
      flash(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function deleteRow(row: EditorRow<AchievementRow>) {
    if (row._isNew) {
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      return;
    }
    if (!confirm("Delete this entry?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/achievements/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await readError(res));
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      flash("Deleted");
      refresh();
    } catch (e) {
      console.error(e);
      flash(`Delete failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Achievements</h2>
        <button onClick={addRow} className="rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 px-3 py-1.5 text-xs hover:bg-[var(--color-orange-50)]">
          + Add entry
        </button>
      </div>
      {rows.map((row) => (
        <div key={row.id} className="rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/70 p-5 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Year" value={row.year} onChange={(v) => update(row.id, { year: v })} />
            <Field label="Sort" type="number" value={String(row.sortOrder)} onChange={(v) => update(row.id, { sortOrder: Number(v) || 0 })} />
            <div>
              <label className="block text-xs font-medium text-[var(--color-ink-soft)]">Icon</label>
              <select
                value={row.icon}
                onChange={(e) => update(row.id, { icon: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[var(--color-orange-300)]/50 bg-white px-2 py-2 text-sm"
              >
                {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Title (AR)" value={row.titleAr} onChange={(v) => update(row.id, { titleAr: v })} />
            <Field label="Title (EN)" value={row.titleEn} onChange={(v) => update(row.id, { titleEn: v })} />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <TextareaField label="Desc (AR)" value={row.descAr} onChange={(v) => update(row.id, { descAr: v })} />
            <TextareaField label="Desc (EN)" value={row.descEn} onChange={(v) => update(row.id, { descEn: v })} />
          </div>
          <MediaGallery
            items={achievementMediaItems(row)}
            onChange={(media) =>
              update(row.id, {
                media: JSON.stringify(media),
                imageUrl: "",
                videoUrl: "",
              })
            }
            flash={flash}
          />
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => deleteRow(row)} disabled={busy} className="text-xs px-3 py-1.5 rounded-full border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60">
              Delete
            </button>
            <button onClick={() => saveRow(row)} disabled={busy} className="text-xs px-4 py-1.5 rounded-full bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white disabled:opacity-60">
              {row._isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Projects editor ---------------- */

function projectMediaItems(row: { media?: string }): MediaItem[] {
  return parseMediaField(row.media);
}

function ProjectsEditor({
  items,
  busy,
  setBusy,
  flash,
  refresh,
}: {
  items: ProjectRow[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  flash: (msg: string) => void;
  refresh: () => void;
}) {
  const [rows, setRows] = useState<EditorRow<ProjectRow>[]>(items);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set(items.map(p => p.field).filter(Boolean)));

  function update(id: number, patch: Partial<ProjectRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch, _dirty: true } : r)));
  }

  function addRowToField(field: string) {
    const tempId = -Date.now();
    setRows((rs) => [
      ...rs,
      {
        id: tempId, year: "", titleAr: "", titleEn: "", descAr: "", descEn: "",
        field, media: "[]",
        sortOrder: rs.filter(r => r.field === field).length + 1, _isNew: true, _dirty: true,
      },
    ]);
  }

  function addNewField() {
    const field = prompt("Enter new field name (e.g., Design, Protection Engineering, IT)");
    if (!field) return;
    setExpandedFields((s) => new Set([...s, field]));
    addRowToField(field);
  }

  async function saveRow(row: EditorRow<ProjectRow>) {
    setBusy(true);
    try {
      const payload = {
        year: row.year, titleAr: row.titleAr, titleEn: row.titleEn,
        descAr: row.descAr, descEn: row.descEn,
        field: row.field,
        media: parseMediaField(row.media),
        sortOrder: row.sortOrder,
      };
      if (row._isNew) {
        const res = await fetch("/api/admin/projects", {
          method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await readError(res));
      } else {
        const res = await fetch(`/api/admin/projects/${row.id}`, {
          method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await readError(res));
      }
      flash("Saved");
      refresh();
    } catch (e) {
      console.error(e);
      flash(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function deleteRow(row: EditorRow<ProjectRow>) {
    if (row._isNew) {
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      return;
    }
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/projects/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await readError(res));
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      flash("Deleted");
      refresh();
    } catch (e) {
      console.error(e);
      flash(`Delete failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  const groupedByField = rows.reduce<Record<string, EditorRow<ProjectRow>[]>>((acc, row) => {
    const field = row.field || "Uncategorized";
    if (!acc[field]) acc[field] = [];
    acc[field].push(row);
    return acc;
  }, {});

  const sortedFields = Object.keys(groupedByField).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Projects</h2>
        <button onClick={addNewField} className="rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 px-3 py-1.5 text-xs hover:bg-[var(--color-orange-50)]">
          + Add project
        </button>
      </div>
      {sortedFields.map((field) => (
        <div key={field} className="rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/70 overflow-hidden">
          <button
            onClick={() => setExpandedFields((s) => {
              const next = new Set(s);
              if (next.has(field)) next.delete(field);
              else next.add(field);
              return next;
            })}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--color-orange-50)] transition"
          >
            <h3 className="font-semibold text-[var(--color-ink)]">{field}</h3>
            <span className="text-sm text-[var(--color-ink-soft)]">
              {expandedFields.has(field) ? "▼" : "▶"} {groupedByField[field].length}
            </span>
          </button>
          {expandedFields.has(field) && (
            <div className="px-5 pb-4 space-y-3 border-t border-[var(--color-orange-300)]/20">
              {groupedByField[field].map((row) => (
                <ProjectRow key={row.id} row={row} field={field} busy={busy} onUpdate={update} onSave={saveRow} onDelete={deleteRow} flash={flash} />
              ))}
              <button
                onClick={() => addRowToField(field)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-dashed border-[var(--color-orange-300)]/40 text-[var(--color-ink-soft)] hover:bg-[var(--color-orange-50)] hover:border-[var(--color-orange-300)]/60 transition"
              >
                + Add project to {field}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectRow({
  row,
  field,
  busy,
  onUpdate,
  onSave,
  onDelete,
  flash,
}: {
  row: EditorRow<ProjectRow>;
  field: string;
  busy: boolean;
  onUpdate: (id: number, patch: Partial<ProjectRow>) => void;
  onSave: (row: EditorRow<ProjectRow>) => void;
  onDelete: (row: EditorRow<ProjectRow>) => void;
  flash: (msg: string) => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-orange-300)]/30 bg-white/50 p-4 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Year" value={row.year} onChange={(v) => onUpdate(row.id, { year: v })} />
        <Field label="Sort" type="number" value={String(row.sortOrder)} onChange={(v) => onUpdate(row.id, { sortOrder: Number(v) || 0 })} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Title (AR)" value={row.titleAr} onChange={(v) => onUpdate(row.id, { titleAr: v })} />
        <Field label="Title (EN)" value={row.titleEn} onChange={(v) => onUpdate(row.id, { titleEn: v })} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <TextareaField label="Desc (AR)" value={row.descAr} onChange={(v) => onUpdate(row.id, { descAr: v })} />
        <TextareaField label="Desc (EN)" value={row.descEn} onChange={(v) => onUpdate(row.id, { descEn: v })} />
      </div>
      <MediaGallery
        items={projectMediaItems(row)}
        onChange={(media) => onUpdate(row.id, { media: JSON.stringify(media) })}
        flash={flash}
        allowPdf
      />
      <div className="flex items-center justify-end gap-2">
        <button onClick={() => onDelete(row)} disabled={busy} className="text-xs px-3 py-1.5 rounded-full border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60">
          Delete
        </button>
        <button onClick={() => onSave(row)} disabled={busy} className="text-xs px-4 py-1.5 rounded-full bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white disabled:opacity-60">
          {row._isNew ? "Create" : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Media: upload + URL input ---------------- */

async function uploadBlob(blob: Blob, name: string, contentType: string): Promise<string> {
  const qs = new URLSearchParams({
    name,
    type: contentType,
    size: String(blob.size),
  });
  const presignRes = await fetch(`/api/admin/upload?${qs.toString()}`);
  if (!presignRes.ok) {
    const data = await presignRes.json().catch(() => ({}));
    throw new Error(data.error || `Upload failed (${presignRes.status})`);
  }
  const { uploadUrl, url, headers } = (await presignRes.json()) as {
    uploadUrl: string;
    url: string;
    headers?: Record<string, string>;
  };

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    body: blob,
    headers: headers ?? { "Content-Type": contentType },
  });
  if (!putRes.ok) {
    throw new Error(`Upload failed (${putRes.status})`);
  }
  return url;
}

async function uploadFile(file: File): Promise<string> {
  return uploadBlob(file, file.name, file.type || "application/octet-stream");
}

async function makeAndUploadPdfThumb(
  pdfBlobOrFile: Blob | File,
  baseName: string,
): Promise<string> {
  const { renderPdfFirstPageToJpeg } = await import("@/lib/pdf-thumb");
  const thumb = await renderPdfFirstPageToJpeg(pdfBlobOrFile);
  const safe = baseName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_") || "pdf";
  return uploadBlob(thumb, `${safe}.thumb.jpg`, "image/jpeg");
}

function UrlUploadField({
  label, value, onChange, accept,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accept: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isVideo = accept.startsWith("video");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setErr(null);
    try {
      const url = await uploadFile(f);
      onChange(url);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-ink-soft)]">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload"
          className="flex-1 rounded-lg border border-[var(--color-orange-300)]/50 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-orange-500)]"
          dir="ltr"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="shrink-0 text-xs px-3 py-2 rounded-lg border border-[var(--color-orange-300)]/60 bg-white/70 hover:bg-[var(--color-orange-50)] disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-xs px-2 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
          >
            Clear
          </button>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onPick} />
      </div>
      {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
      {value && !err && (
        <div className="mt-2">
          {isVideo ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={value} controls className="max-h-40 rounded-lg border border-[var(--color-orange-300)]/40" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value} alt="preview" className="max-h-40 rounded-lg border border-[var(--color-orange-300)]/40 object-contain" />
          )}
        </div>
      )}
    </div>
  );
}

function MediaGallery({
  items,
  onChange,
  flash,
  allowPdf = false,
}: {
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  flash: (msg: string) => void;
  allowPdf?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const acceptAttr = allowPdf ? "image/*,video/*,application/pdf,.pdf" : "image/*,video/*";

  function inferType(file: File): MediaItem["type"] {
    if (allowPdf && (file.type === "application/pdf" || /\.pdf$/i.test(file.name))) return "pdf";
    if (file.type.startsWith("video")) return "video";
    return "image";
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const added: MediaItem[] = [];
      for (const f of Array.from(files)) {
        const type = inferType(f);
        const url = await uploadFile(f);
        const next: MediaItem = { url, type };
        if (type === "pdf") {
          try {
            next.thumbUrl = await makeAndUploadPdfThumb(f, f.name);
          } catch (err) {
            console.warn("pdf thumbnail failed", err);
            flash("Uploaded PDF, but thumbnail render failed");
          }
        }
        added.push(next);
      }
      onChange([...items, ...added]);
      flash("Uploaded");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function regenerateThumb(i: number) {
    const m = items[i];
    if (!m || m.type !== "pdf") return;
    setBusy(true);
    try {
      const { fetchPdfAsBlob } = await import("@/lib/pdf-thumb");
      const blob = await fetchPdfAsBlob(m.url);
      const baseName = m.url.split("/").pop() ?? "pdf";
      const thumbUrl = await makeAndUploadPdfThumb(blob, baseName);
      updateItem(i, { thumbUrl });
      flash("Thumbnail generated");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Thumbnail failed (CORS?)");
    } finally {
      setBusy(false);
    }
  }

  function addByUrl() {
    const url = prompt(allowPdf ? "Paste a public image, video, or PDF URL" : "Paste a public image or video URL");
    if (!url) return;
    const lower = url.toLowerCase();
    const type: MediaItem["type"] =
      allowPdf && /\.pdf(\?|#|$)/i.test(lower) ? "pdf" :
      /\.(mp4|webm|mov|m4v)$/i.test(lower) ? "video" :
      "image";
    onChange([...items, { url: url.trim(), type }]);
  }

  function updateItem(i: number, patch: Partial<MediaItem>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-[var(--color-ink-soft)]">Media (images / videos)</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addByUrl}
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 hover:bg-[var(--color-orange-50)]"
          >
            + URL
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 hover:bg-[var(--color-orange-50)] disabled:opacity-60"
          >
            {busy ? "Uploading…" : "+ Upload"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-2 text-xs text-[var(--color-ink-soft)]">No media yet. Upload certificates, photos, or short videos.</p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((m, i) => (
            <li key={i} className="rounded-xl border border-[var(--color-orange-300)]/40 bg-white p-2 space-y-2">
              {m.type === "video" ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={m.url} controls className="w-full h-32 rounded-lg object-cover" />
              ) : m.type === "pdf" ? (
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block h-32 w-full overflow-hidden rounded-lg bg-white border border-[var(--color-orange-300)]/40"
                >
                  {m.thumbUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={m.thumbUrl} alt={m.caption || "PDF preview"} className="size-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-3xl text-[var(--color-orange-600)]">📄</span>
                  )}
                  <span className="absolute top-1 right-1 rounded-full bg-[var(--color-orange-500)] text-white text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 shadow">PDF</span>
                </a>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={m.url} alt={m.caption ?? ""} className="w-full h-32 rounded-lg object-cover" />
              )}
              <input
                type="text"
                value={m.caption ?? ""}
                onChange={(e) => updateItem(i, { caption: e.target.value })}
                placeholder="Caption (optional)"
                className="w-full rounded-md border border-[var(--color-orange-300)]/40 bg-white px-2 py-1 text-xs"
              />
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="text-[var(--color-ink-soft)] shrink-0">{m.type}</span>
                <div className="flex items-center gap-1.5">
                  {m.type === "pdf" && (
                    <button
                      type="button"
                      onClick={() => regenerateThumb(i)}
                      disabled={busy}
                      className="px-2 py-0.5 rounded-full border border-[var(--color-orange-300)]/60 text-[var(--color-orange-700)] hover:bg-[var(--color-orange-50)] disabled:opacity-60"
                      title="Render the PDF's first page and store it as the cover"
                    >
                      {m.thumbUrl ? "Re-render" : "Generate thumb"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="px-2 py-0.5 rounded-full border border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Reusable small bits ---------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/70 p-5 md:p-6 space-y-4">
      <h3 className="text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label, value, onChange, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-ink-soft)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-[var(--color-orange-300)]/50 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-orange-500)]"
        dir="auto"
      />
    </div>
  );
}

function TextareaField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-ink-soft)]">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border border-[var(--color-orange-300)]/50 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-orange-500)]"
        dir="auto"
      />
    </div>
  );
}

function Bilingual({
  labelAr, valueAr, onChangeAr, labelEn, valueEn, onChangeEn,
}: {
  labelAr: string; valueAr: string; onChangeAr: (v: string) => void;
  labelEn: string; valueEn: string; onChangeEn: (v: string) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <Field label={labelAr} value={valueAr} onChange={onChangeAr} />
      <Field label={labelEn} value={valueEn} onChange={onChangeEn} />
    </div>
  );
}

function BilingualTextarea({
  labelAr, valueAr, onChangeAr, labelEn, valueEn, onChangeEn,
}: {
  labelAr: string; valueAr: string; onChangeAr: (v: string) => void;
  labelEn: string; valueEn: string; onChangeEn: (v: string) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <TextareaField label={labelAr} value={valueAr} onChange={onChangeAr} />
      <TextareaField label={labelEn} value={valueEn} onChange={onChangeEn} />
    </div>
  );
}
