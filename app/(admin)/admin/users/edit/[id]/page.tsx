import { getAdminUserById } from "@/lib/db/user";
import UserEditForm from "./UserEditForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getAdminUserById(id);

  if (!user) {
    return <div>User not found.</div>;
  }

  return <UserEditForm user={user} />;
}