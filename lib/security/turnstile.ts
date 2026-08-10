import "server-only";

export async function verifyTurnstile(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error("[TURNSTILE] Verification unavailable: missing server configuration");
    return { success: false };
  }

  const form = new FormData();

  form.append("secret", secret);
  form.append("response", token);

  if (ip && ip !== "unknown") {
    form.append("remoteip", ip);
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: form,
    }
  );

  const data = (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };

  return data;
}
