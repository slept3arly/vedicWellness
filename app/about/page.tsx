import PageClient from "./AboutClient"

// TEMP: force loading (for testing)
//async function slowRender() {
//  await new Promise((resolve) => setTimeout(resolve, 1200))
//}

export default async function AboutPage() {
//  await slowRender() // ← REMOVE later
  return <PageClient />
}
