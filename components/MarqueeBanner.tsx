import { prisma } from "@/lib/db/prisma"

type MarqueeItem = {
  id: string
  text: string
}

export default async function MarqueeBanner() {
  const items = await prisma.marqueeItem.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  if (!items.length) return null

  // Repeat enough to always fill wide screens (even with 1 item)
  const repeatedItems = Array.from({ length: 12 }).flatMap(() => items)

  /**
   * CONSTANT SPEED LOGIC
   * More items = longer duration
   * Less items = shorter duration
   * → speed stays visually the same
   */
  const BASE_SPEED_PER_ITEM = 3.6 // tweak this (lower = faster, higher = slower)
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
          className="marquee-track animate-marquee"
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
