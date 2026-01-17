import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { deleteUser, updateUserRole } from "./serverActions";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin · Users</h1>

      <div style={{ marginTop: 12 }}>
        <Link href="/admin/users/new">+ Add User</Link>
      </div>

      {users.length === 0 ? (
        <p style={{ marginTop: 24, opacity: 0.7 }}>No users found.</p>
      ) : (
        <ul style={{ marginTop: 24, display: "grid", gap: 12 }}>
          {users.map((u) => (
            <li
              key={u.id}
              style={{
                border: "1px solid #2a2a2a",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: 16 }}>{u.email}</b>
                <span style={{ opacity: 0.75 }}>{u.role}</span>
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <Link href={`/admin/users/edit/${u.id}`}>Edit</Link>

                <form action={updateUserRole} style={{ display: "flex", gap: 8 }}>
                  <input type="hidden" name="id" value={u.id} />
                  <select name="role" defaultValue={u.role}>
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                  <button type="submit">Save Role</button>
                </form>

                <form action={deleteUser}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit">Delete</button>
                </form>
              </div>

              <div style={{ marginTop: 8, opacity: 0.6, fontSize: 12 }}>
                Created: {new Date(u.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
