export default function AdminLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      Processing…
    </div>
  );
}
