import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";

export const revalidate = 21600; // 6 hours

export const metadata: Metadata = {
  title: "Site Map",
  description:
    "Site map of Vedic Wellness – find all public pages, product listings and published Ayurveda blog articles in one place.",
  alternates: { canonical: "/site-map" },
};

export default async function SiteMapPage() {
  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    select: {
      slug: true,
      title: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 500,
  });

  return (
    <section className="w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto mt-24 mb-24">
          <PageHeader title="Vedic Wellness Site Map" />

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
                <SectionHeading title="Company" className="mb-4" />

                <ul className="space-y-2 mb-8">
                  <SitemapLink href="/">Home</SitemapLink>
                  <SitemapLink href="/about">About Vedic Wellness</SitemapLink>
                  <SitemapLink href="/contact">Contact Us</SitemapLink>
                </ul>

                <h3 className="font-heading text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                  Legal
                </h3>

                <ul className="space-y-2 mb-8">
                  <SitemapLink href="/privacy-policy">
                    Privacy Policy
                  </SitemapLink>

                  <SitemapLink href="/terms-conditions">
                    Terms & Conditions
                  </SitemapLink>
                </ul>

                <h3 className="font-heading text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                  Account
                </h3>

                <ul className="space-y-2">
                  <SitemapLink href="/login">Login</SitemapLink>
                  <SitemapLink href="/signup">Create Account</SitemapLink>
                </ul>
              </div>

              {/* COLUMN 2 */}
              <div>
                <SectionHeading
                  title="Ayurvedic Catalogue"
                  className="mb-4"
                />

                <ul className="space-y-2">
                  <SitemapLink href="/products">
                    All Products & Listings
                  </SitemapLink>
                </ul>
              </div>

              {/* COLUMN 3 */}
              <div>
                <SectionHeading
                  title="Knowledge Center"
                  className="mb-4"
                />

                <ul className="space-y-2">
                  <SitemapLink href="/blogs">
                    All Blogs & Updates
                  </SitemapLink>

                  {blogs.map((blog) => (
                    <SitemapLink
                      key={blog.slug}
                      href={`/blogs/${blog.slug}`}
                    >
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
            group relative w-fit inline-block
            text-slate-600
            dark:text-slate-300
            hover:text-neutral-900
            dark:hover:text-white
            transition-colors duration-300
            font-medium
            pb-0.5
          "
        >
          {children}

          <span
            className="
              absolute left-0 bottom-0 h-[1.5px] w-0
              bg-neutral-900 dark:bg-white
              transition-all duration-300 group-hover:w-full
            "
          />
        </Link>
      </li>
    );
  }
}
