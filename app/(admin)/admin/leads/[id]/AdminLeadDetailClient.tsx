"use client";

import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminCard from "@/components/admin/AdminCard";
import PageHeader from "@/components/public/ui/PageHeader";
import { assignLead, deleteLead, updateLeadStatus } from "../serverActions";
import { Mail, Phone, MapPin, Calendar, Clock, Trash2, MessageSquare } from "lucide-react";

const LEAD_STATUSES = ["NEW", "HOT", "WARM", "CONVERTED", "LOST", "USELESS"];

function formatDateTime(value?: Date | string | null) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export default function AdminLeadDetailClient({
  lead,
  salesUsers,
}: {
  lead: any;
  salesUsers: any[];
}) {
  const ownerName = lead.owner?.name || lead.owner?.email || "Unassigned";

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div>
        <PageHeader title={lead.name} subtitle={lead.id} />
        <button
          onClick={() => navigator.clipboard.writeText(lead.id)}
          className="text-xs text-neutral-400 hover:underline mt-1"
        >
          Copy Lead ID
        </button>
      </div>

      <AdminCard className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center">
        <div className="space-y-2">
          <div className="text-sm text-neutral-500">Status</div>
          <AdminBadge status={lead.status} />

          <div className="space-y-1 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Created {formatDateTime(lead.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Claimed {formatDateTime(lead.claimedAt)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="text-right">
            <div className="text-sm text-neutral-500">Owner</div>
            <div className="text-lg font-semibold">{ownerName}</div>
            {lead.owner?.email && (
              <div className="text-xs text-neutral-500">{lead.owner.email}</div>
            )}
          </div>

          <form
            action={deleteLead}
            onSubmit={(e) => {
              if (!confirm(`Delete lead from ${lead.name}?`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={lead.id} />
            <AdminActionButton variant="danger" icon={Trash2}>
              Delete Lead
            </AdminActionButton>
          </form>
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="font-semibold mb-3">Contact Info</h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {lead.email}
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {lead.phone || "No phone provided"}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {lead.city || "No city provided"}
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="font-semibold mb-3">Message</h3>

        <div className="text-sm space-y-1">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="whitespace-pre-wrap break-words">{lead.message || "No message provided."}</p>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="font-semibold mb-3">Assignment</h3>

        <div className="space-y-3">
          <div className="text-sm">
            <div className="text-neutral-500">Current Owner</div>
            <div className="font-medium">{ownerName}</div>
            {lead.owner?.email && (
              <div className="text-xs text-neutral-500">{lead.owner.email}</div>
            )}
          </div>

          <form action={assignLead} className="mt-2 flex gap-2 items-center">
            <input type="hidden" name="leadId" value={lead.id} />

            <select
              name="toUserId"
              defaultValue={lead.ownerId || ""}
              className="h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs px-2"
            >
              <option value="">Unassigned</option>
              {salesUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>

            <AdminActionButton type="submit">
              Save
            </AdminActionButton>
          </form>
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="font-semibold mb-3">Status Control</h3>

        <form action={updateLeadStatus} className="mt-2 flex gap-2 items-center">
          <input type="hidden" name="id" value={lead.id} />

          <select
            name="status"
            defaultValue={lead.status}
            className="h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs px-2"
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <AdminActionButton type="submit">
            Save
          </AdminActionButton>
        </form>
      </AdminCard>
    </div>
  );
}
