import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
<div className="pt-4 lg:pt-8 px-12">
    <div className="flex flex-row justify-between">
      <div className="flex flex-row px-4 py-1 gap-3 bg-neutral-800/90 rounded-lg">
          <Link href="/admin">
            Back to Admin
          </Link>
      </div>
      <div className="flex flex-row px-4 py-1 gap-3 bg-neutral-800/90 rounded-lg ">
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/blogs">Blogs</Link>
        <Link href="/admin/marquee">Marquee</Link>
      </div>
    </div>

    <div>{children}</div>
</div>
  );
}