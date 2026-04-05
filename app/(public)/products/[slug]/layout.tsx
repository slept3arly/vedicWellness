// layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>; // Change this to Promise
}) {
  // Await the params before using them
  const { slug } = await params; 
  
  const session = await auth();

  if (!session?.user) {
    // Use the awaited slug here
    redirect(`/login?next=/products/${encodeURIComponent(slug)}`);
  }

  return <>{children}</>;
}