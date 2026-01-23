export const limits = {
  signup: { windowSeconds: 60, max: 5 },
  contact: { windowSeconds: 60, max: 5 },     // ✅ ADD THIS
  loginIp: { windowSeconds: 600, max: 30 },
  loginEmail: { windowSeconds: 600, max: 8 },
  r2UploadUrl: { windowSeconds: 60, max: 20 },
} as const;
