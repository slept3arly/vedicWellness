import "server-only";
import { getBrevoClient } from "./client";

export async function addSubscriberToBrevo(email: string) {
  try {
    const client = getBrevoClient();

    const response = await client.contacts.createContact({
      email,
      listIds: [2], // your Brevo list id
      updateEnabled: true,
    });

    return { success: true, data: response };
  } catch (error: any) {
    console.error(
      "Brevo contact error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to add subscriber",
    };
  }
}