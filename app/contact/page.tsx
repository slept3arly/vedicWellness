import ContactClient from "./ContactClient"

// TEMP: force loading (for testing)
//async function slowRender() {
//  await new Promise((resolve) => setTimeout(resolve, 1200))
//}

export default async function BlogsPage() {
//  await slowRender() // ← REMOVE later
  return <ContactClient />
}
