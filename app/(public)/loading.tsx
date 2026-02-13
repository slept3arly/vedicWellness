"use client";

export default function LoadingPill() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="ribbon-loader" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
