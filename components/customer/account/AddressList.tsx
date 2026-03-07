"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import { Plus, Check, MapPin, Trash, Edit2 } from "lucide-react";
import type { Address } from "@prisma/client";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/(customer)/account/serverActions";
import AddressFormModal from "./AddressFormModal";
import CustomerButton from "@/components/customer/CustomerButton";
import Card from "@/components/public/ui/Card";

type Props = {
  addresses: Address[];
  externalOpen?: boolean;
  onExternalOpenChange?: (val: boolean) => void;
};

export default function AddressList({
  addresses,
  externalOpen,
  onExternalOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;

  function setOpen(val: boolean) {
    if (onExternalOpenChange) onExternalOpenChange(val);
    else setInternalOpen(val);
  }

  const maxReached = addresses.length >= 5;

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddressAction(id, true);
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddressAction(id);
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to update default address");
    }
  }

  return (
    <>
      <Card className="flex flex-col h-full p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold font-heading text-[var(--text-main)]">Saved Addresses</h3>
            <p className="text-xs font-body text-[var(--text-muted)] mt-0.5 uppercase tracking-widest">
              {addresses.length} / 5 limit
            </p>
          </div>
          <CustomerButton
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            disabled={maxReached}
          >
            <Plus className="w-4 h-4 mr-1 inline" />
            Add
          </CustomerButton>
        </div>

        {/* List */}
        {!addresses.length ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-center">
            <MapPin className="w-7 h-7 text-[var(--text-muted)] opacity-40 mb-1" />
            <p className="text-sm text-[var(--text-muted)]">No addresses saved yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={`group relative flex items-start justify-between gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  a.isDefault
                    ? "border-brand-primary/30 bg-brand-primary/[0.02]"
                    : "border-[var(--border-soft)] hover:border-brand-primary/30"
                }`}
              >
                {/* Left */}
                <div className="flex gap-3 items-start flex-1 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {a.isDefault ? (
                      <div className="w-4 h-4 rounded-full bg-brand-primary flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(a.id)}
                        className="w-4 h-4 rounded-full border-2 border-[var(--text-muted)] opacity-30 hover:border-brand-primary hover:opacity-100 transition-all focus:outline-none"
                        aria-label="Set as default"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold font-heading text-[var(--text-main)] truncate">
                        {a.fullName}
                      </p>
                      {a.isDefault && (
                        <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-body text-[var(--text-muted)] leading-relaxed">
                      {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.postalCode}
                    </p>
                    <p className="text-xs font-body font-medium text-[var(--text-muted)] mt-1">{a.phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <CustomerButton
                    variant="secondary"
                    className="w-8 h-8 min-w-0 px-0 flex items-center justify-center"
                    onClick={() => {
                      setEditing(a);
                      setOpen(true);
                    }}
                    aria-label="Edit address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </CustomerButton>
                  <CustomerButton
                    variant="secondary"
                    onClick={() => handleDelete(a.id)}
                    className="w-8 h-8 min-w-0 px-0 flex items-center justify-center text-red-500 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
                    aria-label="Delete address"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </CustomerButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

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