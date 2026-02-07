import { Variants, Transition } from "framer-motion";

/* ---------------- Entrance ---------------- */

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

/* ---------------- Z-Lift Icon (Depth) ---------------- */

export const zLiftIcon: Variants = {
  rest: {
    scale: 1,
    opacity: 0.9,
  },
  hover: {
    scale: 1.08,
    opacity: 1,
  },
};

/* ---------------- Shared Hover Spring (FAST) ---------------- */

export const zLiftSpring: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 22,
  mass: 0.6,
};

export const pressHold: Variants = {
  rest: {
    scale: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  hold: {
    scale: 0.97,
    backgroundColor: "rgba(34,197,94,0.12)",
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};


/* ======================================================
   SHARED SPRINGS (APPLE-ESQUE)
====================================================== */

export const softSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 22,
  mass: 0.7,
};

export const fastSpring: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 24,
  mass: 0.6,
};

/* ======================================================
   ENTRANCE / REVEAL
====================================================== */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: softSpring,
  },
};





/* ======================================================
   CARD INTERACTION
====================================================== */

export const cardInteraction: Variants = {
  rest: { y: 0 },
  hover: { y: -6, transition: fastSpring },
};

/* ======================================================
   ICON GLOW
====================================================== */

export const cardIconGlow: Variants = {
  rest: { opacity: 0, scale: 0.9 },
  hover: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};


