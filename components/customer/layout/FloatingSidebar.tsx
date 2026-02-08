"use client";

import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

const links = [
  { label: "My Account", href: "/account" },
  { label: "My Cart", href: "/cart" },
  { label: "Orders", href: "/orders" },
];

export default function FloatingSidebar() {
  return (
    <Card className="sticky top-24">
      <nav className="flex flex-col gap-2">
        {links.map((l) => (
          <Button
            key={l.href}
            variant="secondary"
            className="justify-start"
            onClick={() => (window.location.href = l.href)}
          >
            {l.label}
          </Button>
        ))}
      </nav>
    </Card>
  );
}
