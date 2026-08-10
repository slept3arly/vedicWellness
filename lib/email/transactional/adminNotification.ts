import "server-only";

import { getResendClient } from "./client";

type LeadNotification = {
  type: "lead";
  leadId: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  message: string;
};

type OrderNotification = {
  type: "order";
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: Date;
  totalAmount: number;
  currency: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
  shippingAddress: Record<string, unknown>;
};

export type AdminNotification = LeadNotification | OrderNotification;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function display(value: unknown) {
  return escapeHtml(value == null ? "—" : String(value));
}

function formatDate(date: Date) {
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

function formatAddress(address: Record<string, unknown>) {
  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .map(display)
    .join(", ");
}

function getSubject(notification: AdminNotification) {
  return notification.type === "lead"
    ? `New Lead Received — ${notification.name}`
    : `New Order Received — #${notification.orderId.slice(-8).toUpperCase()}`;
}

function getHtml(notification: AdminNotification) {
  if (notification.type === "lead") {
    return `<h1>New Lead Received</h1>
      <p><strong>Name:</strong> ${display(notification.name)}</p>
      <p><strong>Email:</strong> ${display(notification.email)}</p>
      <p><strong>Phone:</strong> ${display(notification.phone)}</p>
      <p><strong>City:</strong> ${display(notification.city)}</p>
      <p><strong>Message:</strong><br>${display(notification.message).replace(/\n/g, "<br>")}</p>
      <p><strong>Lead ID:</strong> ${display(notification.leadId)}</p>`;
  }

  const items = notification.items
    .map(
      (item) =>
        `<li>${display(item.productName)} × ${display(item.quantity)} — ${display(notification.currency)} ${display(item.price * item.quantity)}</li>`
    )
    .join("");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;
  const adminLink = siteUrl
    ? `${siteUrl.replace(/\/$/, "")}/admin/orders/${encodeURIComponent(notification.orderId)}`
    : null;

  return `<h1>New Order Received</h1>
    <p><strong>Order number:</strong> #${display(notification.orderId.slice(-8).toUpperCase())}</p>
    <p><strong>Customer:</strong> ${display(notification.customerName)}</p>
    <p><strong>Email:</strong> ${display(notification.customerEmail)}</p>
    <p><strong>Phone:</strong> ${display(notification.customerPhone)}</p>
    <p><strong>Order date:</strong> ${display(formatDate(notification.createdAt))}</p>
    <p><strong>Products:</strong></p><ul>${items}</ul>
    <p><strong>Total:</strong> ${display(notification.currency)} ${display(notification.totalAmount)}</p>
    <p><strong>Delivery address:</strong> ${formatAddress(notification.shippingAddress)}</p>
    ${adminLink ? `<p><a href="${escapeHtml(adminLink)}">View order in admin</a></p>` : ""}`;
}

export async function sendAdminNotification(notification: AdminNotification) {
  const recipient = process.env.ADMIN_EMAIL;
  const from = process.env.EMAIL_FROM;

  if (!recipient || !from) {
    throw new Error("Admin notification email is not configured");
  }

  const result = await getResendClient().emails.send({
    from,
    to: [recipient],
    subject: getSubject(notification),
    html: getHtml(notification),
  });

  if (result.error) {
    throw new Error("Admin notification email failed");
  }
}
