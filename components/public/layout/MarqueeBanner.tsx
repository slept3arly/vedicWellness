import { prisma } from "@/lib/db/prisma"

type MarqueeItem = {
  id: string
  text: string
}

export default async function MarqueeBanner() {
  const items = await prisma.marqueeItem.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      text: true,
    },
  })

  if (!items.length) return null

  /**
   * ✅ FIX 1 — Smart repeat logic
   * Prevents DOM from growing too large if more items are added later
   */
  const repeatCount = Math.max(6, Math.ceil(10 / items.length))
  const repeatedItems = Array.from({ length: repeatCount }).flatMap(() => items)

  /**
   * CONSTANT SPEED LOGIC
   */
  const BASE_SPEED_PER_ITEM = 3.6
  const duration = repeatedItems.length * BASE_SPEED_PER_ITEM

  return (
    <div
      className="
        absolute left-3 right-3 lg:left-9 lg:right-9
        top-[5rem] lg:top-[6.5rem]
      "
    >
      <div className="overflow-hidden rounded-lg bg-[#84eb4b] marquee-mask">
        <div
          className="marquee-track animate-marquee will-change-transform"
          style={{ animationDuration: `${duration}s` }}
        >
          <MarqueeStrip items={repeatedItems} />
          <MarqueeStrip items={repeatedItems} />
        </div>
      </div>
    </div>
  )
}

function MarqueeStrip({ items }: { items: MarqueeItem[] }) {
  return (
    <div className="flex items-center py-1.5 text-sm font-semibold text-black uppercase tracking-wide whitespace-nowrap">
      {items.map((item, i) => (
        <span key={`${item.id}-${i}`} className="flex items-center">
          <span className="mx-6">•</span>
          {item.text}
        </span>
      ))}
    </div>
  )
}