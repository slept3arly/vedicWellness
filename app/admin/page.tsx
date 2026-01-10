import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Dashboard</h1>

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
