import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
<div className="lg:pt-8 px-4 lg:px-28 ">
    <div className="flex flex-row justify-between items-center">
      <div className="flex px-4 py-1 gap-3 bg-neutral-800/90 rounded-lg">
          <Link href="/admin">
            Admin Panel
          </Link>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-3 px-4 py-1 gap-1 bg-neutral-800/90 rounded-lg">
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/blogs">Blogs</Link>
        <Link href="/admin/marquee">Marquee</Link>
      </div>
    </div>

    <div>{children}</div>
</div>
  );
}