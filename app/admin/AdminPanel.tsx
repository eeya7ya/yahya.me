"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { RoadmapRow, AchievementRow } from "@/lib/schema";
import { contentToFlat, type SiteContent } from "@/lib/settings";

type Props = {
  content: SiteContent;
  roadmap: RoadmapRow[];
  achievements: AchievementRow[];
  dbConnected: boolean;
};

type Tab = "content" | "roadmap" | "achievements";

const ICON_OPTIONS = ["spark", "trophy", "bolt", "sun"] as const;

export default function AdminPanel({ content, roadmap, achievements, dbConnected }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("content");
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
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
          {(["content", "roadmap", "achievements"] as Tab[]).map((t) => (
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
      if (!res.ok) throw new Error(await res.text());
      flash("Saved");
      refresh();
    } catch (e) {
      flash("Save failed");
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
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await fetch(`/api/admin/roadmap/${row.id}`, {
          method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      flash("Saved");
      refresh();
    } catch (e) {
      console.error(e);
      flash("Save failed");
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
      if (!res.ok) throw new Error(await res.text());
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      flash("Deleted");
      refresh();
    } catch (e) {
      console.error(e);
      flash("Delete failed");
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
        icon: "spark", sortOrder: rs.length + 1, _isNew: true, _dirty: true,
      },
    ]);
  }

  async function saveRow(row: EditorRow<AchievementRow>) {
    setBusy(true);
    try {
      const payload = {
        year: row.year, titleAr: row.titleAr, titleEn: row.titleEn,
        descAr: row.descAr, descEn: row.descEn, icon: row.icon, sortOrder: row.sortOrder,
      };
      if (row._isNew) {
        const res = await fetch("/api/admin/achievements", {
          method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await fetch(`/api/admin/achievements/${row.id}`, {
          method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      flash("Saved");
      refresh();
    } catch (e) {
      console.error(e);
      flash("Save failed");
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
      if (!res.ok) throw new Error(await res.text());
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      flash("Deleted");
      refresh();
    } catch (e) {
      console.error(e);
      flash("Delete failed");
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
