"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

export default function DeferredFooter() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setShow(true));
    } else {
      setTimeout(() => setShow(true), 300);
    }
  }, []);

  if (!show) return null;
  return <Footer />;
}
