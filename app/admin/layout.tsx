import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin" style={{ textDecoration: "underline" }}>
            ← Back to Admin
          </Link>

          <div style={{ opacity: 0.6 }}>|</div>

          <Link href="/admin/products">Products</Link>
          <Link href="/admin/blogs">Blogs</Link>
          <Link href="/admin/marquee">Marquee</Link>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
