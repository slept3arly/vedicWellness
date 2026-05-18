export const limits = {
  signup: { windowSeconds: 60, max: 5 },
  contact: { windowSeconds: 60, max: 5 },
  loginIp: { windowSeconds: 600, max: 30 },
  loginEmail: { windowSeconds: 600, max: 8 },
  r2UploadUrl: { windowSeconds: 60, max: 20 },

  // ✅ OTP email sending limit
  otpEmail: { windowSeconds: 300, max: 3 }, // 3 OTP emails per 5 min
  newsletter: { windowSeconds: 60, max: 5 },
} as const;