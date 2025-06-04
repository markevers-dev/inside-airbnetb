"use client";

import React, { useRef, useEffect, CSSProperties } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  lightWidth?: number;
  duration?: number;
  lightColor?: string;
  borderWidth?: number;
  className?: string;
  [key: string]: unknown;
}

export function BorderBeam({
  lightWidth = 200,
  duration = 10,
  lightColor = "#FAFAFA",
  borderWidth = 1,
  className,
  ...props
}: BorderBeamProps) {
  const pathRef = useRef<HTMLDivElement>(null);

  const updatePath = () => {
    if (pathRef.current) {
      const div = pathRef.current;
      div.style.setProperty(
        "--path",
        `path("M 0 0 H ${div.offsetWidth} V ${div.offsetHeight} H 0 V 0")`
      );
    }
  };

  useEffect(() => {
    updatePath();
    window.addEventListener("resize", updatePath);

    return () => {
      window.removeEventListener("resize", updatePath);
    };
  }, []);

  return (
    <div
      style={
        {
          "--duration": duration,
          "--border-width": `${borderWidth}px`,
        } as CSSProperties
      }
      ref={pathRef}
      className={cn(
        `absolute rounded-[inherit] z-0 w-full h-full`,
        `after:content-[''] after:absolute after:inset-[var(--border-width)] after:rounded-[inherit]`,
        "![mask-clip:padding-box,border-box] border-[length:var(--border-width)]",
        "![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(red,red)]",
        `before:border-black/10 dark:before:border-white/10 before:absolute before:inset-0 before:rounded-[inherit] before:z-[-1] before:border-[length:var(--border-width)]`,
        className
      )}
      {...props}
    >
      <motion.div
        className="absolute aspect-square inset-0 bg-[radial-gradient(ellipse_at_center,var(--light-color),transparent,transparent)]"
        style={
          {
            "--light-color": lightColor,
            "--light-width": `${lightWidth}px`,
            width: "var(--light-width)",
            offsetPath: "var(--path)",
          } as CSSProperties
        }
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
