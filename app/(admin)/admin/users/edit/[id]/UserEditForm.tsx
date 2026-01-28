"use client";

import Link from "next/link";
import { updateUser } from "../../serverActions";

export default function UserEditForm({ user }: { user: any }) {
  return (
    <div style={{ maxWidth: 760, padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Edit User</h1>

      <form action={updateUser} style={{ marginTop: 18, display: "grid", gap: 12 }}>
        <input type="hidden" name="id" value={user.id} />

        <input name="email" type="email" defaultValue={user.email} required />

        <select name="role" defaultValue={user.role}>
          <option value="ADMIN">ADMIN</option>
          <option value="SALES">SALES</option>
          <option value="VIEWER">VIEWER</option>
        </select>

        <div>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Reset Password (optional)</p>
          <input
            name="password"
            type="password"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Save</button>
          <Link href="/admin/users">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
