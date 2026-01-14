"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="ribbon-loader" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
