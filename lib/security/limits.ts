import "server-only";

export const limits = {
  // 5 requests/min per IP
  contact: { windowSeconds: 60, max: 5 },

  // ✅ signup attempts
  signup: { windowSeconds: 60, max: 3 },

  // admin write actions
  adminWrite: { windowSeconds: 60, max: 60 },

  // signed upload url creation
  r2UploadUrl: { windowSeconds: 60, max: 20 },
} as const;
