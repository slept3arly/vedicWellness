import "server-only";
import { getBrevoClient } from "./client";

export async function addSubscriberToBrevo(email: string) {
  console.log(`👤 [addSubscriberToBrevo] Attempting to add contact: ${email}`);
  try {
    const client = getBrevoClient();

    console.log("👤 [addSubscriberToBrevo] Dispatching createContact request to Brevo...");
    const response = await client.contacts.createContact({
      email,
      listIds: [2], // your Brevo list id
      updateEnabled: true,
    });

    console.log("✅ [addSubscriberToBrevo] Contact added/updated successfully. Response:", JSON.stringify(response, null, 2));
    return { success: true, data: response };
  } catch (error: any) {
    console.error("❌ [addSubscriberToBrevo] Brevo contact creation failed:");
    console.error(`- Error message: ${error.message}`);
    
    if (error.response) {
      console.error(`- HTTP Status: ${error.response.status}`);
      console.error("- Response Data:", JSON.stringify(error.response.data || error.response.body, null, 2));
    } else {
      console.error("- Error object:", error);
    }

    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Failed to add subscriber",
    };
  }
}