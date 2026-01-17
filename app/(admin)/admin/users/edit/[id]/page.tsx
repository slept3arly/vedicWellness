import { prisma } from "@/lib/db/prisma";
import UserEditForm from "./UserEditForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findFirst({ where: { id } });
  if (!user) return <div>User not found.</div>;

  return <UserEditForm user={user} />;
}
