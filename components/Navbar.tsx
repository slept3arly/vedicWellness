import { auth } from "@/auth"
import NavbarClient from "./NavbarClient"

export default async function Navbar() {
  const session = await auth()

  const role = session?.user?.role ?? null

  return <NavbarClient role={role} />
}
