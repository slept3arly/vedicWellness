"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
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

type FieldErrors = Partial<Record<keyof FormState, string>>;

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

export default function AddressFormModal({
  open,
  onClose,
  initialData,
}: Props) {
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  /* Mount + scroll lock */
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Populate form when editing */
  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName,
        phone: initialData.phone,
        line1: initialData.line1,
        line2: initialData.line2 ?? "",
        city: initialData.city,
        state: initialData.state,
        postalCode: initialData.postalCode,
      });
    } else {
      setForm({
        fullName: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
      });
    }
    setErrors({});
    setServerError("");
  }, [initialData, open]);

  if (!mounted || !open) return null;

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    if (form.fullName.trim().length < 2)
      next.fullName = "Full name is required";

    if (!/^[0-9]{10}$/.test(form.phone))
      next.phone = "Phone must be 10 digits";

    if (form.line1.trim().length < 5)
      next.line1 = "Address line is required";

    if (form.city.trim().length < 2)
      next.city = "City is required";

    if (form.state.trim().length < 2)
      next.state = "State is required";

    if (!/^[0-9]{6}$/.test(form.postalCode))
      next.postalCode = "Postal code must be 6 digits";

    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (initialData) {
        await updateAddressAction(initialData.id, {
          ...form,
          country: "India",
        });
      } else {
        await addAddressAction({
          ...form,
          country: "India",
        });
      }

      onClose();
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong.");
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-lg p-6 sm:p-8">
          <p className="font-medium mb-6 text-lg">
            {initialData ? "Edit Address" : "Add New Address"}
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <input
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className={inputClass(!!errors.fullName)}
                placeholder="Full Name"
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                value={form.phone}
                onChange={(e) =>
                  update(
                    "phone",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                inputMode="numeric"
                className={inputClass(!!errors.phone)}
                placeholder="Phone Number"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Address Line */}
            <div>
              <input
                value={form.line1}
                onChange={(e) => update("line1", e.target.value)}
                className={inputClass(!!errors.line1)}
                placeholder="Address Line"
              />
              {errors.line1 && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.line1}
                </p>
              )}
            </div>

            <input
              value={form.line2}
              onChange={(e) => update("line2", e.target.value)}
              className={inputClass()}
              placeholder="Apartment / Landmark (optional)"
            />

            {/* City & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass(!!errors.city)}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <input
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className={inputClass(!!errors.state)}
                  placeholder="State"
                />
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.state}
                  </p>
                )}
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <input
                value={form.postalCode}
                onChange={(e) =>
                  update(
                    "postalCode",
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                inputMode="numeric"
                className={inputClass(!!errors.postalCode)}
                placeholder="Postal Code (6 digits)"
              />
              {errors.postalCode && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.postalCode}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-500">{serverError}</p>
            )}

            <p className="text-xs text-[var(--text-muted)] pt-2">
              Please ensure your address details are accurate. Vedic Wellness
              will not be responsible for delivery issues arising from incorrect
              address information.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {initialData ? "Update Address" : "Save Address"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>,
    document.body
  );
}
