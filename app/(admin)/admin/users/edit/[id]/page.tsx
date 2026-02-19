import { prisma } from "@/lib/db/prisma";
import UserEditForm from "./UserEditForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ⭐ IMPORTANT: block deleted users
  const user = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  return <UserEditForm user={user} />;
}
