"use client"

import { useEffect, useState } from "react"

export default function MarqueeBanner() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setCollapsed(window.scrollY > 500)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`
        absolute left-3 right-3 lg:left-9 lg:right-9
        top-[5rem] lg:top-[6.5rem]
        transition-transform duration-300 ease-out
        ${collapsed ? "-translate-y-16  lg:-translate-y-20" : "translate-y-0"}
      `}
    >
      <div className="overflow-hidden rounded-lg bg-[#84eb4b]">
        <div className="flex w-max animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 px-3 py-2
                text-sm font-semibold text-black uppercase
                tracking-wide whitespace-nowrap"
            >
              <span>Blogs Live</span>
              <span>•</span>
              <span>Welcome To Vedic Wellness</span>
              <span>•</span>
              <span>Interested? Let us know</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
