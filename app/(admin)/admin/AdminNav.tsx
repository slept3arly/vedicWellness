"use client";

import Link from "next/link";

export default function AdminNav() {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex gap-3 rounded-lg px-4 py-1">
        <Link href="/admin">Admin Panel</Link>
      </div>

      <div className="flex flex-col gap-1 rounded-lg px-4 py-1 text-right text-black dark:text-white lg:flex-row lg:gap-3">
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/blogs">Blogs</Link>
        <Link href="/admin/marquee">Marquee</Link>
        <Link href="/admin/leads">Leads</Link>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/logs">Logs</Link>
      </div>
    </div>
  );
}
