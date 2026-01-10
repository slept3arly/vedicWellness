import { prisma } from "@/lib/prisma";

export default async function MarqueeBanner() {
  const items = await prisma.marqueeItem.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  if (items.length === 0) return null;

  return (
    <div
      className={`
        absolute left-3 right-3 lg:left-9 lg:right-9
        top-[5rem] lg:top-[6.5rem]
      `}
    >
      <div className="overflow-hidden rounded-lg bg-[#84eb4b]">
        <div className="flex w-max animate-marquee">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="flex items-center py-1.5
              text-sm font-semibold text-black uppercase
              tracking-wide whitespace-nowrap"
            >
              <span className="mx-6">•</span>
              {items.map((item, idx) => (
                <span key={item.id}>
                  {item.text}
                  {idx !== items.length - 1 && <span className="mx-6">•</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
