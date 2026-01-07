"use client";

export default function RibbonLoader() {
  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50">
      <div className="loading-pill">
        <div className="apple-spinner" />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
