"use client";

import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

function inputClass() {
  return `
    w-full rounded-[14px] px-4 py-3 text-sm
    bg-[var(--bg-surface)]
    border border-[var(--border-soft)]
    text-[var(--text-main)]
    placeholder:text-[var(--text-muted)]
    focus:outline-none
    focus:border-[color:var(--brand-primary)]/50
    focus:ring-2 focus:ring-[color:var(--brand-primary)]/25
  `;
}

export default function AccountDetailsForm() {
  return (
    <Card>
      <p className="font-medium mb-4">Personal Details</p>

      <div className="grid gap-4">
        <input className={inputClass()} placeholder="Full Name" />
        <input className={inputClass()} placeholder="Email" />
        <input className={inputClass()} placeholder="Phone" />

        <Button>Save Changes</Button>
      </div>
    </Card>
  );
}
