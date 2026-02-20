import { redis } from "@/lib/redis";

const TTL_SECONDS = 600;

export function getSignupSessionKey(email: string) {
  return `signup:session:${email}`;
}

export async function saveSignupSession(email: string, data: any) {
  await redis.set(
    getSignupSessionKey(email),
    JSON.stringify(data),
    { ex: TTL_SECONDS }
  );
}

export async function getSignupSession(email: string) {
  const raw = await redis.get(getSignupSessionKey(email));

  if (!raw) return null;

  // ✅ Upstash may already return parsed object
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return raw;
}

export async function deleteSignupSession(email: string) {
  await redis.del(getSignupSessionKey(email));
}

export async function updateSignupSession(email: string, data: any) {
  const key = getSignupSessionKey(email);
  const ttl = await redis.ttl(key);

  if (ttl <= 0) return;

  await redis.set(key, JSON.stringify(data), { ex: ttl });
}