"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "@/lib/toast";
import { X } from "lucide-react";
import Card from "@/components/public/ui/Card";
import CustomerButton from "@/components/customer/CustomerButton";
import {
  addAddressAction,
  updateAddressAction,
} from "@/app/(customer)/account/serverActions";

type AddressData = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: AddressData;
};

type FormState = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
};

function inputClass(hasError?: boolean) {
  return `
    w-full rounded-[14px] px-4 py-3 text-sm
    bg-[var(--bg-surface)]
    border
    ${
      hasError
        ? "border-red-500 focus:ring-red-500/30"
        : "border-[var(--border-soft)] focus:border-[color:var(--brand-primary)]/50 focus:ring-2 focus:ring-[color:var(--brand-primary)]/25"
    }
    text-[var(--text-main)]
    placeholder:text-[var(--text-muted)]
    focus:outline-none
  `;
}

export default function AddressFormModal({ open, onClose, initialData }: Props) {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});

  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setForm(
      initialData
        ? {
            fullName: initialData.fullName,
            phone: initialData.phone,
            line1: initialData.line1,
            line2: initialData.line2 ?? "",
            city: initialData.city,
            state: initialData.state,
            postalCode: initialData.postalCode,
          }
        : {
            fullName: "",
            phone: "",
            line1: "",
            line2: "",
            city: "",
            state: "",
            postalCode: "",
          }
    );

    setErrors({});
  }, [initialData, open]);

  if (!mounted || !open) return null;

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, boolean>> = {};
    const messages: string[] = [];

    if (form.fullName.trim().length < 2) {
      next.fullName = true;
      messages.push("Full name is required");
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      next.phone = true;
      messages.push("Phone must be 10 digits");
    }

    if (form.line1.trim().length < 5) {
      next.line1 = true;
      messages.push("Address line is too short");
    }

    if (form.city.trim().length < 2) {
      next.city = true;
      messages.push("City is required");
    }

    if (form.state.trim().length < 2) {
      next.state = true;
      messages.push("State is required");
    }

    if (!/^[0-9]{6}$/.test(form.postalCode)) {
      next.postalCode = true;
      messages.push("Postal code must be 6 digits");
    }

    if (messages.length) {
      setErrors(next);

      toast.error(
        messages[0],
        messages.length > 1
          ? `+${messages.length - 1} more issue${messages.length > 2 ? "s" : ""}`
          : undefined
      );

      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      if (initialData) {
        await updateAddressAction(initialData.id, {
          ...form,
          country: "India",
        });

        toast.success("Address updated successfully");
      } else {
        await addAddressAction({
          ...form,
          country: "India",
        });

        toast.success("Address saved successfully");
      }

      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-lg"
        onClick={onClose}
      />

      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-lg p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-lg text-[var(--text-main)]">
              {initialData ? "Edit Address" : "Add New Address"}
            </p>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <input
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className={inputClass(errors.fullName)}
              placeholder="Full Name"
            />

            <input
              value={form.phone}
              onChange={(e) =>
                update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              inputMode="numeric"
              className={inputClass(errors.phone)}
              placeholder="Phone Number"
            />

            <input
              value={form.line1}
              onChange={(e) => update("line1", e.target.value)}
              className={inputClass(errors.line1)}
              placeholder="Address Line"
            />

            <input
              value={form.line2}
              onChange={(e) => update("line2", e.target.value)}
              className={inputClass()}
              placeholder="Apartment / Landmark (optional)"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass(errors.city)}
                placeholder="City"
              />

              <input
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className={inputClass(errors.state)}
                placeholder="State"
              />
            </div>

            <input
              value={form.postalCode}
              onChange={(e) =>
                update(
                  "postalCode",
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              inputMode="numeric"
              className={inputClass(errors.postalCode)}
              placeholder="Postal Code (6 digits)"
            />

            <p className="text-xs text-[var(--text-muted)] pt-1">
              Please ensure your address details are accurate. Vedic Wellness
              will not be responsible for delivery issues arising from incorrect
              address information.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <CustomerButton
                type="submit"
                className="flex-1"
                isLoading={submitting}
              >
                {initialData ? "Update Address" : "Save Address"}
              </CustomerButton>

              <CustomerButton
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                ignoreFormStatus
                disabled={submitting}
              >
                Cancel
              </CustomerButton>
            </div>
          </form>
        </Card>
      </div>
    </div>,
    document.body
  );
}