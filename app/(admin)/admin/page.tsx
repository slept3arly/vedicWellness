import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div style={{ padding: 24 }} className="flex flex-col whitespace-nowrap">
      <h1 style={{ fontSize: 28, fontWeight: 700 }} className="pb-4 pt-4">Admin Dashboard</h1>

      <ul style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <li>
          <Link href="/admin/products">1 Products</Link>
        </li>
        <li>
          <Link href="/admin/blogs">2 Blogs</Link>
        </li>
        <li>
          <Link href="/admin/marquee">3 Marquee Banner</Link>
        </li>
        <li>
          <Link href="/admin/leads">4 Leads</Link>
        </li>
        <li>
          <Link href="/admin/users">5 Users</Link>
        </li>
        <li>
          <Link href="/admin/logs">6 Logs</Link>
        </li>
      </ul>
    </div>
  );
}
