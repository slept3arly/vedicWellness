import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div style={{ padding: 24 }} className="flex flex-col whitespace-nowrap">
      <h1 style={{ fontSize: 28, fontWeight: 700 }} className="pb-4 pt-4">Admin Dashboard</h1>

      <ul style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <li>
          <Link href="/admin/products">📦 Products</Link>
        </li>
        <li>
          <Link href="/admin/blogs">📝 Blogs</Link>
        </li>
        <li>
          <Link href="/admin/marquee">📢 Marquee Banner</Link>
        </li>
      </ul>
    </div>
  );
}
