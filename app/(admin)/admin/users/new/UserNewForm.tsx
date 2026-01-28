"use client";

import Link from "next/link";
import { createUser } from "../serverActions";

export default function UserNewForm() {
  return (
    <div style={{ padding: 24, maxWidth: 760 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Add User</h1>
      <p style={{ opacity: 0.7 }}>Create a new user account.</p>

      <form action={createUser} style={{ marginTop: 18, display: "grid", gap: 12 }}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />

        <select name="role" defaultValue="VIEWER">
          <option value="ADMIN">ADMIN</option>
          <option value="SALES">SALES</option>
          <option value="VIEWER">VIEWER</option>
        </select>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Create</button>
          <Link href="/admin/users">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
