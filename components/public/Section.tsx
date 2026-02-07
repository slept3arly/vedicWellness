import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Section({ children, className }: Props) {
  return (
    <section
      className={`max-w-7xl mx-auto px-6 py-28 ${className || ""}`}
    >
      {children}
    </section>
  );
}
