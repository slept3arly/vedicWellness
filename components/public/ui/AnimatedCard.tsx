"use client";

import { ReactNode, forwardRef, useEffect, useState } from "react";
import { m, MotionProps } from "framer-motion";
import Card from "./Card";

type AnimatedCardProps = {
    children: ReactNode;
    className?: string;
    hoverLift?: boolean;
} & Omit<React.ComponentPropsWithoutRef<typeof m.div>, "children">;

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(function AnimatedCard(
    { children, className, hoverLift = true, ...props },
    ref
) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)");
        queueMicrotask(() => setIsDesktop(media.matches));

        const listener = () => setIsDesktop(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    // Compute the motion setup dynamically
    const hoverAnimation = hoverLift && isDesktop ? { y: -4 } : undefined;

    return (
        <m.div
            ref={ref}
            whileHover={hoverAnimation}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            style={{ willChange: "transform" }}
            {...props}
        >
            {/* Forwards all underlying layout classes down seamlessly */}
            <Card className={className}>
                {children}
            </Card>
        </m.div>
    );
});

export default AnimatedCard;
