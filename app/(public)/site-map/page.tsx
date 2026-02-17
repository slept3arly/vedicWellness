import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import Card from "@/components/public/ui/Card";

export const dynamic = "force-dynamic";

export default async function SiteMapPage() {

  const products = await prisma.product.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  const blogs = await prisma.blog.findMany({
    select: { slug: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return (
  <section className="w-full">
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] mx-auto mt-24 mb-24">

        {/* Title — same spacing rhythm as policy pages */}
        <h1 className="text-3xl md:text-4xl font-semibold">
          Vedic Wellness Site Map
        </h1>

        {/* IMPORTANT: surface applied exactly like policy card */}
        <div
          className="
            surface
            rounded-2xl
            p-6 md:p-10
            leading-relaxed
            mt-10
          "
        >
          <div className="grid md:grid-cols-3 gap-x-20 gap-y-10 text-sm md:text-base">

            {/* COLUMN 1 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Company</h2>

              <ul className="space-y-2 mb-8">
                <SitemapLink href="/">Home</SitemapLink>
                <SitemapLink href="/about">About Vedic Wellness</SitemapLink>
                <SitemapLink href="/contact">Contact Us</SitemapLink>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Legal</h3>

              <ul className="space-y-2 mb-8">
                <SitemapLink href="/privacy-policy">Privacy Policy</SitemapLink>
                <SitemapLink href="/terms-conditions">Terms & Conditions</SitemapLink>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Account</h3>

              <ul className="space-y-2">
                <SitemapLink href="/login">Login</SitemapLink>
                <SitemapLink href="/signup">Create Account</SitemapLink>
              </ul>
            </div>

            {/* COLUMN 2 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Ayurvedic Catalogue
              </h2>

              <ul className="space-y-2">
                <SitemapLink href="/products">All Products & Listings</SitemapLink>

                {products.map((product) => (
                  <SitemapLink key={product.slug} href={`/products/${product.slug}`}>
                    {product.name}
                  </SitemapLink>
                ))}
              </ul>
            </div>

            {/* COLUMN 3 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Knowledge Center
              </h2>

              <ul className="space-y-2">
                <SitemapLink href="/blogs">All Blogs & Updates</SitemapLink>

                {blogs.map((blog) => (
                  <SitemapLink key={blog.slug} href={`/blogs/${blog.slug}`}>
                    {blog.title}
                  </SitemapLink>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
);


/* ---------- Privacy-page style link ---------- */

function SitemapLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="
          text-muted
          hover:text-[var(--brand-primary)]
          transition
          font-medium
        "
      >
        {children}
      </Link>
    </li>
  );
}
}
