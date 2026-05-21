// Cover used when a PDF entry has no rendered thumbnail yet.
// Keeps a consistent, on-brand look across desktop and mobile instead of
// the browser's broken iframe fallback.

export default function PdfCoverPlaceholder({ url }: { url: string }) {
  const filename = decodeURIComponent(url.split("/").pop() ?? "document.pdf").replace(/^\d+-[a-z0-9]+-/i, "");
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[var(--color-orange-50)] via-white to-[var(--color-orange-100)]/60 px-4 text-center">
      <span aria-hidden className="text-4xl md:text-5xl">📄</span>
      <span className="text-[11px] md:text-xs font-medium text-[var(--color-ink-soft)] line-clamp-2 break-all">
        {filename}
      </span>
    </div>
  );
}
