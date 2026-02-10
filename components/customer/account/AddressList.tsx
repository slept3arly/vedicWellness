"use client";

import { useState } from "react";
import Card from "@/components/public/ui/Card";
import CustomerButton from "@/components/customer/CustomerButton";
import type { Address } from "@prisma/client";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/(customer)/account/serverActions";
import AddressFormModal from "./AddressFormModal";

type Props = {
  addresses: Address[];
};

export default function AddressList({ addresses }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium">Saved Addresses</p>

          <CustomerButton size="sm" onClick={() => setOpen(true)}>
            Add New
          </CustomerButton>
        </div>

        {!addresses.length ? (
          <p className="text-sm text-muted">No saved addresses yet.</p>
        ) : (
          <div className="space-y-3 text-sm">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="border border-[var(--border-soft)] rounded-xl p-4 flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">{a.fullName}</p>
                  <p className="text-muted">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                    <br />
                    {a.city}, {a.state} {a.postalCode}
                  </p>

                  {a.isDefault && (
                    <span className="inline-block mt-2 text-xs text-[color:var(--brand-accent)]">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!a.isDefault && (
                    <form action={() => setDefaultAddressAction(a.id)}>
                      <CustomerButton
                        size="sm"
                        variant="secondary"
                        type="submit"
                      >
                        Set Default
                      </CustomerButton>
                    </form>
                  )}

                  <form
                    action={() => {
                      if (!confirm("Delete this address?")) return;
                      return deleteAddressAction(a.id, true);
                    }}
                  >
                    <CustomerButton
                      size="sm"
                      variant="secondary"
                      type="submit"
                    >
                      Delete
                    </CustomerButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AddressFormModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
