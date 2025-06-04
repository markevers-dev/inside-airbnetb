"use client";

import React, { useState, useEffect, ReactNode, CSSProperties } from "react";
import { stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
  duration?: number;
  staggerDelay?: number;
  height?: number;
}

export function StaggerButton({
  className,
  children,
  duration = 0.2,
  staggerDelay = 0.05,
  height = 26,
  ...props
}: StaggerButtonProps) {
  const [scope, animate] = useAnimate();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (isHovered) {
      animate([
        [
          ".letter",
          {
            rotateX: 90,
          },
          { duration, delay: stagger(staggerDelay) },
        ],
        [
          ".letter::after",
          {
            rotateX: 90,
          },
          { duration, delay: stagger(staggerDelay) },
        ],
      ]);
    } else {
      animate([
        [
          ".letter",
          {
            rotateX: 0,
          },
          { duration, delay: stagger(staggerDelay) },
        ],
        [
          ".letter::after",
          {
            rotateX: -90,
          },
          { duration, delay: stagger(staggerDelay) },
        ],
      ]);
    }
  }, [isHovered, animate, duration, staggerDelay]);

  const lettersArray = children?.toString().split("") || [];

  return (
    <div
      ref={scope}
      style={
        {
          "--height": `${height}px`,
          perspective: "1000px",
        } as CSSProperties
      }
    >
      <button
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          "relative bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          className
        )}
        {...props}
      >
        <span className="sr-only">{children}</span>
        <span
          aria-hidden
          className="h-[--height] overflow-hidden flex items-center justify-center relative"
        >
          {lettersArray.map((letter, index) => (
            <span
              style={{
                transformStyle: "preserve-3d",
                transition: `transform cubic-bezier(0.3, 0.65, 0.4, 1)`,
              }}
              data-letter={letter}
              key={`${letter}-${index}`}
              className="letter inline-block h-[--height] leading-[--height]"
            >
              <span className="opacity-0">{letter === " " ? " " : letter}</span>
            </span>
          ))}
          <style jsx>{`
            .letter::before {
              content: attr(data-letter);
              position: absolute;
              left: 0;
              top: 0;
              transform: rotateX(0deg) translateZ(calc(var(--height) / 2));
            }
            .letter::after {
              content: attr(data-letter);
              position: absolute;
              left: 0;
              top: 0;
              transform: rotateX(-90deg) translateZ(calc(var(--height) / 2));
            }
          `}</style>
        </span>
      </button>
    </div>
  );
}
