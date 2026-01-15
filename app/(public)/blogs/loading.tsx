"use client";

export default function LoadingPill() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="ribbon-loader" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
