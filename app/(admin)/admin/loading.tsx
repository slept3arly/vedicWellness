"use client";

export default function LoadingPill() {
  return (
    <div className="h-dvh w-full flex items-center justify-center">
      <div className="-translate-y-10">
        <div className="ribbon-loader" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}