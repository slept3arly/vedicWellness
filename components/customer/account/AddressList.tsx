"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import { MapPin, Pencil, Trash2, Star, Plus } from "lucide-react";
import CustomerButton from "@/components/customer/CustomerButton";
import type { Address } from "@prisma/client";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/(customer)/account/serverActions";
import AddressFormModal from "./AddressFormModal";

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
    if (!confirm("Delete this address?")) return;
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
      <div
        className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 flex flex-col h-full"
        style={{ minHeight: 220 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
            <p className="font-semibold text-sm text-[var(--text-main)]">
              Saved Addresses
            </p>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
              {addresses.length}/5
            </span>
          </div>

          <CustomerButton
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            disabled={maxReached}
          >
            <Plus className="w-3.5 h-3.5 mr-1 inline-block" />
            Add New
          </CustomerButton>
        </div>

        {maxReached && (
          <p className="shrink-0 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 rounded-lg px-3 py-2 mb-3">
            Maximum of 5 addresses reached. Delete one to add another.
          </p>
        )}

        {!addresses.length ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
            </div>

            <div>
              <p className="text-sm font-medium text-[var(--text-main)]">
                No saved addresses
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Add one to speed up checkout
              </p>
            </div>

            <CustomerButton
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add your first address
            </CustomerButton>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-lg border px-3 py-3 text-sm
                ${
                  a.isDefault
                    ? "border-emerald-300/60 dark:border-emerald-700/40 bg-emerald-50/30 dark:bg-emerald-950/20"
                    : "border-[var(--border-soft)]"
                }`}
              >
                {/* Address text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--text-main)]">
                      {a.fullName}
                    </p>

                    {a.isDefault && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {a.line1}
                  </p>

                  {a.line2 && (
                    <p className="text-xs text-[var(--text-muted)]">
                      {a.line2}
                    </p>
                  )}

                  <p className="text-xs text-[var(--text-muted)]">
                    {a.city}, {a.state} — {a.postalCode}
                  </p>

                  <p className="text-xs text-[var(--text-muted)]">
                    {a.phone}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <CustomerButton
                    variant="secondary"
                    onClick={() => {
                      setEditing(a);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="w-3 h-3" />
                  </CustomerButton>

                  {!a.isDefault && (
                    <CustomerButton
                      variant="secondary"
                      onClick={() => handleSetDefault(a.id)}
                    >
                      <Star className="w-3 h-3" />
                    </CustomerButton>
                  )}

                  <CustomerButton
                    variant="secondary"
                    onClick={() => handleDelete(a.id)}
                    className="text-red-500 border-red-400/40 hover:bg-red-50 hover:border-red-400 dark:text-red-400 dark:border-red-400/20 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </CustomerButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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