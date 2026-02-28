"use client";

export default function RibbonLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center pointer-events-none">
      <div className="mt-20">
        <div className="loading-pill">
          <div className="apple-spinner" />
          <span className="sr-only">Loading</span>
        </div>
      </div>
    </div>
  );
}
