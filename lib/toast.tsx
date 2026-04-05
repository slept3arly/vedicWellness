import { toast as sonnerToast } from "sonner";

const baseOptions = {
  duration: 2000,
};

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, {
      ...baseOptions,
      description,
    }),

  error: (message: string, description?: string) =>
    sonnerToast.error(message, {
      ...baseOptions,
      description,
    }),

  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, {
      ...baseOptions,
      description,
    }),

  info: (message: string, description?: string) =>
    sonnerToast(message, {
      ...baseOptions,
      description,
    }),

  destructive: (message: string, description?: string) =>
    sonnerToast.error(message, {
      ...baseOptions,
      description,
    }),
};