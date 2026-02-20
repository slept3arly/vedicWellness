import crypto from "crypto";

/**
 * Generates a secure 6-digit OTP string
 */
export function generateOtp(): string {
  // crypto.randomInt is cryptographically secure
  return crypto.randomInt(100000, 999999).toString();
}