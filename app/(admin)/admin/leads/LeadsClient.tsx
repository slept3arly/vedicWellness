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

const STATUS_LABEL: Record<Status, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  CONVERTED: "Converted",
  LOST: "Lost",
};

/* ============ ACTION BUTTON ============ */

function ActionButton({
  action,
  data,
  variant = "secondary",
  children,
}: {
  action: (fd: FormData) => Promise<void>;
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
      className={pending ? "opacity-50" : ""}
    >
      {pending ? "Working…" : children}
    </AdminButton>
  );
}

/* ============ PAGE ============ */

export default function LeadsClient({ leads }: { leads: LeadWithOwner[] }) {
  const [active, setActive] = useState<Status>("NEW");

  const filtered = leads.filter((l) => l.status === active);

  return (
    <div className="space-y-6">

      {/* PIPELINE TABS */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const count = leads.filter((l) => l.status === s).length;
          const activeTab = active === s;

          return (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`px-4 py-2 rounded-xl border text-sm flex items-center gap-2 transition
                ${
                  activeTab
                    ? "bg-green-500/15 border-green-400 text-green-400"
                    : "border-neutral-700 text-neutral-400 hover:text-neutral-200"
                }`}
            >
              {STATUS_LABEL[s]}
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-xs">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* LEAD CARDS */}
      <div className="space-y-4">
        {filtered.map((lead) => (
          <AdminCard key={lead.id} className="p-6 space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {lead.name}
                  {lead.status === "NEW" && (
                    <Flame size={16} className="text-orange-400" />
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Owner: {lead.owner?.email || "Unclaimed"}
                </p>
              </div>

              <AdminBadge status={lead.status} />
            </div>

            {/* BODY */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* CONTACT */}
              <div className="space-y-2 text-sm">
                <Line icon={Mail} value={lead.email} />
                {lead.phone && <Line icon={Phone} value={lead.phone} />}
                {lead.city && <Line icon={MapPin} value={lead.city} />}
              </div>

              {/* MESSAGE */}
              <div className="bg-muted rounded-xl p-4 text-sm leading-relaxed">
                {lead.message}
              </div>

            </div>

            {/* FOOTER */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">

              <div className="flex items-center gap-2">
                <Calendar size={14} />
                Created:{" "}
                {new Date(lead.createdAt).toLocaleDateString()}
                {lead.claimedAt && (
                  <span className="ml-2">
                    • Claimed: {new Date(lead.claimedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">

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
            </div>

          </AdminCard>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No leads in this stage.
          </p>
        )}
      </div>
    </div>
  );
}

/* ============ HELPER ============ */

function Line({ icon: Icon, value }: { icon: any; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="opacity-70" />
      <span>{value}</span>
    </div>
  );
}
