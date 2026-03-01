import { toast as sonnerToast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Trash2,
} from "lucide-react";

const baseOptions = {
  duration: 4000,
};

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, {
      ...baseOptions,
      description,
      icon: <CheckCircle2 className="text-green-500" size={18} />,
    }),

  error: (message: string, description?: string) =>
    sonnerToast.error(message, {
      ...baseOptions,
      description,
      icon: <XCircle className="text-red-500" size={18} />,
    }),

  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, {
      ...baseOptions,
      description,
      icon: <AlertTriangle className="text-amber-500" size={18} />,
    }),

  info: (message: string, description?: string) =>
    sonnerToast(message, {
      ...baseOptions,
      description,
      icon: <Info className="text-blue-500" size={18} />,
    }),

  delete: (message: string, description?: string) =>
    sonnerToast.error(message, {
      ...baseOptions,
      description,
      icon: <Trash2 className="text-red-600" size={18} />,
    }),
};