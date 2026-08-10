export const limits = {
  signup: { windowSeconds: 60, max: 5 },
  contact: { windowSeconds: 60, max: 5 },
  loginIp: { windowSeconds: 600, max: 30 },
  loginEmail: { windowSeconds: 600, max: 8 },
  r2UploadUrl: { windowSeconds: 60, max: 20 },
  order: { windowSeconds: 60, max: 10 },

  newsletter: { windowSeconds: 60, max: 5 },
} as const;
