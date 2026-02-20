import { redis } from "@/lib/redis";

const TTL_SECONDS = 600;

/**
 * 🔐 Shape of signup session stored in Upstash
 */
export interface SignupSession {
  email: string;
  password: string;
  role: string;
  otpHash: string;
  attempts: number;
}

export function getSignupSessionKey(email: string) {
  return `signup:session:${email}`;
}

export async function saveSignupSession(
  email: string,
  data: SignupSession
) {
  // ✅ Upstash auto-serializes objects — DO NOT stringify
  await redis.set(getSignupSessionKey(email), data, {
    ex: TTL_SECONDS,
  });
}

export async function getSignupSession(
  email: string
): Promise<SignupSession | null> {
  // ✅ Tell Upstash the expected type
  const session = await redis.get<SignupSession>(
    getSignupSessionKey(email)
  );

  if (!session) return null;

  return session;
}

export async function deleteSignupSession(email: string) {
  await redis.del(getSignupSessionKey(email));
}

export async function updateSignupSession(
  email: string,
  data: SignupSession
) {
  const key = getSignupSessionKey(email);
  const ttl = await redis.ttl(key);

  // If expired or missing, do nothing
  if (ttl <= 0) return;

  // ✅ Upstash safe write (no stringify)
  await redis.set(key, data, { ex: ttl });
}