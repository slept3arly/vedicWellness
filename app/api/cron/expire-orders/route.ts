import { expireOldOrders } from "@/lib/services/orderExpiryService";
import { NextResponse } from "next/server";

// Using Node.js runtime instead of edge to ensure Prisma has full access
export const runtime = "nodejs";

export async function GET(request: Request) {
  // Check for Authorization header matching the CRON_SECRET
  // In Vercel, cron jobs automatically send the `Authorization: Bearer <CRON_SECRET>` header.
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await expireOldOrders();
    return NextResponse.json({ success: true, message: "Order expiry executed successfully." });
  } catch (error) {
    console.error("[CRON EXPIRE ORDERS ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
