"use client";

import { memo } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X, LucideIcon } from "lucide-react";

interface PhilosophyModalCard {
  title: string;
  summary: string;
  body: string;
  icon: LucideIcon;
  image?: string;
}

interface PhilosophyFeatureModalProps {
  isOpen: boolean;
  card: PhilosophyModalCard | null;
  onClose: () => void;
}

const premiumEase = [0.22, 1, 0.36, 1] as const;

const PhilosophyFeatureModal = memo(function PhilosophyFeatureModal({
  isOpen,
  card,
  onClose,
}: PhilosophyFeatureModalProps) {
  if (!card) return null;

  const ModalIcon = card.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "linear" }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-4 transform-gpu"
        >
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: premiumEase }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0a0f0d] border border-[var(--border-soft)] rounded-2xl shadow-2xl p-6 mb-2 overflow-hidden transform-gpu will-change-transform"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/15 text-[color:var(--brand-accent)] dark:bg-[color:var(--brand-primary)]/25">
                <ModalIcon size={18} />
              </div>
              <div className="space-y-2 pr-6">
                <div>
                  <h4 className="font-heading text-base font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-[color:var(--brand-accent)] mt-0.5">
                    {card.summary}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {card.body}
                </p>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
});

export default PhilosophyFeatureModal;
