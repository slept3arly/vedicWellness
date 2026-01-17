import { prisma } from "@/lib/db/prisma";
import { deleteLead, toggleLeadDone } from "./serverActions";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin · Leads</h1>
      <p style={{ opacity: 0.7, marginTop: 6 }}>
        Incoming leads from your contact form.
      </p>

      {leads.length === 0 ? (
        <p style={{ marginTop: 24, opacity: 0.7 }}>No leads yet.</p>
      ) : (
        <ul style={{ marginTop: 24, display: "grid", gap: 12 }}>
          {leads.map((l) => (
            <li
              key={l.id}
              style={{
                border: "1px solid #2a2a2a",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: 16 }}>{l.name}</b>
                <span style={{ opacity: 0.7 }}>
                  {new Date(l.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{ marginTop: 6, opacity: 0.85 }}>
                <div>
                  <span style={{ opacity: 0.7 }}>Email:</span>{" "}
                  <a href={`mailto:${l.email}`}>{l.email}</a>
                </div>

                {l.phone ? (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ opacity: 0.7 }}>Phone:</span>{" "}
                    <a href={`tel:${l.phone}`}>{l.phone}</a>
                  </div>
                ) : null}

                <div style={{ marginTop: 8, opacity: 0.9 }}>
                  <span style={{ opacity: 0.7 }}>Message:</span>
                  <p style={{ marginTop: 6, opacity: 0.85 }}>{l.message}</p>
                </div>

                {(l.ip || l.userAgent) && (
                  <div style={{ marginTop: 8, opacity: 0.7, fontSize: 12 }}>
                    {l.ip ? (
                      <span>
                        IP: <code>{l.ip}</code>
                      </span>
                    ) : null}
                    {l.userAgent ? (
                      <span style={{ marginLeft: 12 }}>
                        UA: <code>{l.userAgent}</code>
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                <form action={toggleLeadDone}>
                  <input type="hidden" name="id" value={l.id} />
                  <input
                    type="hidden"
                    name="done"
                    value={String((l as any).done ?? false)}
                  />
                  <button type="submit">
                    {(l as any).done ? "Mark Open" : "Mark Done"}
                  </button>
                </form>

                <form action={deleteLead}>
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit">Delete</button>
                </form>

                <span style={{ marginLeft: "auto", opacity: 0.8 }}>
                  {(l as any).done ? "✅ Done" : "🟡 Open"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
