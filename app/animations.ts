import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const fadeUpSoft: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
};

export const staggerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const staggerSlow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

export const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
