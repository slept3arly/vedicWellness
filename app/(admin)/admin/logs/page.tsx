import { prisma } from "@/lib/db/prisma";

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin · Logs</h1>
      <p style={{ opacity: 0.7, marginTop: 6 }}>
        Audit trail of admin actions (last 200).
      </p>

      {logs.length === 0 ? (
        <p style={{ marginTop: 24, opacity: 0.7 }}>No logs yet.</p>
      ) : (
        <ul style={{ marginTop: 24, display: "grid", gap: 12 }}>
          {logs.map((l) => (
            <li
              key={l.id}
              style={{
                border: "1px solid #2a2a2a",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: 16 }}>{l.action}</b>
                <span style={{ opacity: 0.7 }}>
                  {new Date(l.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{ marginTop: 8, opacity: 0.9 }}>
                <div>
                  <span style={{ opacity: 0.7 }}>Actor:</span>{" "}
                  <code>{l.actorId}</code>
                </div>

                <div style={{ marginTop: 4 }}>
                  <span style={{ opacity: 0.7 }}>Entity:</span>{" "}
                  <code>
                    {l.entityType}
                    {l.entityId ? `:${l.entityId}` : ""}
                  </code>
                </div>

                {(l.ip || l.userAgent) && (
                  <div style={{ marginTop: 4, opacity: 0.75 }}>
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

              <details style={{ marginTop: 10 }}>
                <summary style={{ cursor: "pointer", opacity: 0.85 }}>
                  Metadata
                </summary>
                <pre
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    opacity: 0.8,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    background: "#8d8d8d",
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #2a2a2a",
                  }}
                >
                  {JSON.stringify(l.metadata, null, 2)}
                </pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
