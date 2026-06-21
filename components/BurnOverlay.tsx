// Warm "ember glow" overlay that ignites on hover. Drop it inside a
// `group` + `overflow-hidden` element (e.g. the About photo card) and it
// stays invisible until the parent is hovered. Purely decorative.

const EMBERS = [
  { left: "14%", delay: "0s", drift: "-12px" },
  { left: "32%", delay: "0.7s", drift: "8px" },
  { left: "52%", delay: "1.3s", drift: "-6px" },
  { left: "70%", delay: "0.4s", drift: "14px" },
  { left: "86%", delay: "1.7s", drift: "-10px" },
];

export default function BurnOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    >
      {/* heat glow rising from the bottom edge */}
      <div className="burn-flicker absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--color-orange-500)]/55 via-[var(--color-orange-400)]/20 to-transparent" />
      {/* ignited rim */}
      <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-[var(--color-orange-400)]/40 shadow-[inset_0_-30px_50px_-20px_rgba(240,138,43,0.6)]" />
      {/* rising sparks */}
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{ left: e.left, animationDelay: e.delay, ["--ember-drift" as string]: e.drift }}
        />
      ))}
    </div>
  );
}
