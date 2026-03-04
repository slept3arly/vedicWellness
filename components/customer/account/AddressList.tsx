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
  const [editing, setEditing] = useState<Address | null>(null);

  const maxReached = addresses.length >= 5;

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium">Saved Addresses</p>

          <CustomerButton
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            disabled={maxReached}
          >
            Add New
          </CustomerButton>
        </div>

        {maxReached && (
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Maximum of 5 addresses allowed.
          </p>
        )}

        {!addresses.length ? (
          <p className="text-sm text-[var(--text-muted)]">
            No saved addresses yet.
          </p>
        ) : (
          <div className="space-y-3 text-sm">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="border border-[var(--border-soft)] rounded-md p-4 flex justify-between items-start gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{a.fullName}</p>
                  <p className="text-[var(--text-muted)] mt-0.5 leading-relaxed">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                    <br />
                    {a.city}, {a.state} {a.postalCode}
                  </p>

                  {a.isDefault && (
                    <span className="inline-block mt-2 text-xs font-semibold text-[#039751] dark:text-[#84eb4b]">
                      ✦ Default
                    </span>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap shrink-0">
                  {/* Edit */}
                  <CustomerButton
                    variant="secondary"
                    onClick={() => {
                      setEditing(a);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </CustomerButton>

                  {/* Set Default */}
                  {!a.isDefault && (
                    <form action={() => setDefaultAddressAction(a.id)}>
                      <CustomerButton
                        variant="secondary"
                        type="submit"
                      >
                        Set Default
                      </CustomerButton>
                    </form>
                  )}

                  {/* Delete */}
                  <form
                    action={() => {
                      if (!confirm("Delete this address?")) return;
                      return deleteAddressAction(a.id, true);
                    }}
                  >
                    <CustomerButton
                      variant="secondary"
                      type="submit"
                      className="text-red-500 border-red-400/40 hover:bg-red-50 hover:border-red-400 dark:text-red-400 dark:border-red-400/20 dark:hover:bg-red-950/30 dark:hover:border-red-400/40"
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

      {/* Modal */}
      <AddressFormModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        initialData={
          editing
            ? {
                id: editing.id,
                fullName: editing.fullName,
                phone: editing.phone,
                line1: editing.line1,
                line2: editing.line2 ?? "",
                city: editing.city,
                state: editing.state,
                postalCode: editing.postalCode,
              }
            : undefined
        }
      />
    </>
  );
}