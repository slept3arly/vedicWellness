"use client";

import dynamic from "next/dynamic";

const BottomNavbar = dynamic(
  () => import("./BottomNavbar"),
  { ssr: false }
);

export default function BottomNavbarClient() {
  return <BottomNavbar />;
}
