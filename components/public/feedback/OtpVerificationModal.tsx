"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import { toast } from "@/lib/toast";

type Props = {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
};

export default function OtpVerificationModal({
  open,
  email,
  onClose,
  onVerified,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ NEW STATES
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  /* Mount + scroll lock */
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ✅ Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  if (!mounted || !open) return null;

  async function handleVerify() {
    if (!email) {
      toast.error("Verification error", "Email not found. Please try signing up again.",
      );
      return;
    }

    if (otp.length !== 6) {
      toast.warning("Invalid OTP","Please enter the 6-digit code.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Verification failed", data?.error || "Invalid or expired OTP.",
        );
        setIsLoading(false);
        return;
      }

      toast.success("Account verified successfully", "You can now login to your account.",
      );

      onVerified();
      onClose();
    } catch (err) {
      toast.error("Verification failed", "Unexpected server error.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ NEW — Resend OTP handler
  async function handleResendOtp() {
    if (!email) return;
    if (cooldown > 0) return;

    try {
      setResending(true);

      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to resend OTP", data?.error || "Please try again later.",
        );
        return;
      }

      toast.success("New OTP sent","Check your email for the new code.",
      );

      // start cooldown
      setCooldown(30);
    } catch (err) {
      toast.error("Resend failed","Unexpected server error.",
      );
    } finally {
      setResending(false);
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
        <Card className="w-full max-w-md p-6 sm:p-8 text-center space-y-6">
          <div>
            <p className="text-lg font-semibold">Verify Your Email</p>

            <p className="text-sm text-[var(--text-muted)] mt-2">
              Enter the 6-digit code sent to:
            </p>

            <p className="text-sm font-medium mt-1 break-all">{email}</p>
          </div>

          <input
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputMode="numeric"
            placeholder="Enter OTP"
            className="
              w-full text-center tracking-[8px]
              rounded-[14px] px-4 py-3 text-lg font-semibold
              bg-[var(--bg-surface)]
              border border-[var(--border-soft)]
              focus:outline-none focus:ring-2
              focus:ring-[color:var(--brand-primary)]/25
            "
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleVerify}
              isLoading={isLoading}
              className="flex-1"
            >
              Verify OTP
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

          {/* ✅ NEW — Resend Section */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending || cooldown > 0}
            className="text-sm text-blue-500 disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>
        </Card>
      </div>
    </div>,
    document.body
  );
}