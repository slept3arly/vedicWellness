export default function NotFoundPage() {
  return (
    <main className="items-center text-center mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Page not found</h1>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        The page you’re looking for doesn’t exist or was moved.
      </p>

      <div className="mt-8">
        <a
          href="/"
          className="inline-flex rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
