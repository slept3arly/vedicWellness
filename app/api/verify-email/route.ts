import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { signIn } from "@/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("http://localhost:3000/login");
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.redirect("http://localhost:3000/login");
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: {
      verified: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  // Auto login
  await signIn("credentials", {
    email: record.user.email,
    verificationLogin: "true",
    redirect: false,
  });

  return NextResponse.redirect("http://localhost:3000/products");
}