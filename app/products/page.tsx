import ProductsClient from "./ProductsClient"

// TEMP: force loading (for testing)
//async function slowRender() {
//  await new Promise((resolve) => setTimeout(resolve, 2000))
//}

export default async function BlogsPage() {
//  await slowRender() // ← REMOVE later
  return <ProductsClient />
}
