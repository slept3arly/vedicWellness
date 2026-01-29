"use client";

import { useState, useTransition } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  Flame,
  Clock,
  UserPlus,
  MessageCircle,
  User,
  Calendar,
} from "lucide-react";

import AdminCard from "../components/ui/AdminCard";
import AdminBadge from "../components/ui/AdminBadge";
import AdminButton from "../components/ui/AdminButton";
import { claimLead, updateLeadStatus, deleteLead } from "./serverActions";
import { Prisma } from "@prisma/client";

type LeadWithOwner = Prisma.LeadGetPayload<{
  include: { owner: true };
}>;

type Status = LeadWithOwner["status"];

const STATUSES: Status[] = ["NEW", "IN_PROGRESS", "CONVERTED", "LOST"];

const STATUS_META: Record<Status, { icon: any; label: string }> = {
  NEW: { icon: Flame, label: "New Leads" },
  IN_PROGRESS: { icon: Clock, label: "In Progress" },
  CONVERTED: { icon: CheckCircle, label: "Converted" },
  LOST: { icon: XCircle, label: "Lost Leads" },
};

/* ================= ACTION BUTTON ================= */

function ActionButton({
  action,
  data,
  variant = "secondary",
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  data: Record<string, string>;
  variant?: any;
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  const run = () => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    startTransition(() => action(fd));
  };

  return (
    <AdminButton
      variant={variant}
      onClick={run}
      disabled={pending}
      aria-busy={pending}
      className={`flex items-center gap-2 ${
        pending && "opacity-50 cursor-not-allowed"
      }`}
    >
      {pending ? "Working…" : children}
    </AdminButton>
  );
}

/* ================= PAGE ================= */

export default function LeadsClient({ leads }: { leads: LeadWithOwner[] }) {
  const [active, setActive] = useState<Status>("NEW");

  const filtered = leads.filter((l) => l.status === active);

  return (
    <div className="flex flex-col gap-6">

      {/* ===== STATUS TABS ===== */}
      <nav className="flex flex-wrap gap-2" role="tablist">
        {STATUSES.map((s) => {
          const Icon = STATUS_META[s].icon;
          const isActive = active === s;
          const count = leads.filter((l) => l.status === s).length;

          return (
            <button
              key={s}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition
                ${
                  isActive
                    ? "bg-green-500/15 border-green-400 text-green-400"
                    : "border-neutral-700 text-neutral-400 hover:text-neutral-200"
                }`}
            >
              <Icon size={18} />
              {STATUS_META[s].label}
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800">
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ===== LEADS ===== */}
      <div className="space-y-4">

        {filtered.map((lead, index) => (
          <AdminCard key={lead.id} className="p-6 space-y-5">

            {/* HEADER */}
            <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-semibold">{lead.name}</h3>
                <p className="text-xs text-neutral-500">
                  {lead.owner?.email || "Unclaimed"}
                </p>
              </div>
              <AdminBadge status={lead.status} />
            </div>

            {/* INFO */}
            <div className="grid md:grid-cols-2 gap-6 text-sm">

              <div className="space-y-3">
                <Info icon={User} label="Name" value={lead.name} />
                <Info icon={Mail} label="Email" value={lead.email} />
                {lead.phone && <Info icon={Phone} label="Phone" value={lead.phone} />}
                {lead.city && <Info icon={MapPin} label="City" value={lead.city} />}
              </div>

              <div className="flex gap-2">
                <MessageSquare size={16} className="opacity-60 mt-1" />
                <p className="text-neutral-300">{lead.message}</p>
              </div>
            </div>

            {/* META */}
            <div className="text-xs text-neutral-500 flex items-center gap-2">
              <Calendar size={14} />
              {new Date(lead.claimedAt ?? lead.createdAt).toLocaleDateString()}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2 pt-2">

              {!lead.owner && (
                <ActionButton action={claimLead} data={{ id: lead.id }}>
                  <UserPlus size={14} /> Claim
                </ActionButton>
              )}

              {lead.phone && (
                <a href={`https://wa.me/+91${lead.phone}`} target="_blank">
                  <AdminButton variant="secondary">
                    <MessageCircle size={14} /> WhatsApp
                  </AdminButton>
                </a>
              )}

              {active !== "IN_PROGRESS" && (
                <ActionButton
                  action={updateLeadStatus}
                  data={{ id: lead.id, status: "IN_PROGRESS" }}
                >
                  <Clock size={14} /> In Progress
                </ActionButton>
              )}

              {active !== "CONVERTED" && (
                <ActionButton
                  action={updateLeadStatus}
                  data={{ id: lead.id, status: "CONVERTED" }}
                >
                  <CheckCircle size={14} /> Converted
                </ActionButton>
              )}

              {active !== "LOST" && (
                <ActionButton
                  action={updateLeadStatus}
                  data={{ id: lead.id, status: "LOST" }}
                >
                  <XCircle size={14} /> Lost
                </ActionButton>
              )}

              <ActionButton
                variant="danger"
                action={deleteLead}
                data={{ id: lead.id }}
              >
                <Trash2 size={14} /> Delete
              </ActionButton>

            </div>
          </AdminCard>
        ))}

        {filtered.length === 0 && (
          <p className="text-center opacity-60 py-12">
            No leads in this stage.
          </p>
        )}

      </div>
    </div>
  );
}

/* ================= HELPER ================= */

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="opacity-70" />
      <span className="opacity-60">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
