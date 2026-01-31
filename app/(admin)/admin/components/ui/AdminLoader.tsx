export default function AdminLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="
        inline-flex items-center gap-3
        rounded-lg
        border border-neutral-300
        bg-white px-3 py-2
        text-sm font-medium text-neutral-700

        dark:border-neutral-700
        dark:bg-neutral-900
        dark:text-neutral-300
      "
    >
      <span className="relative h-4 w-4">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent dark:border-neutral-600" />
      </span>

      Processing…
    </div>
  );
}
