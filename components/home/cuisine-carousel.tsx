"use client";

import Image from "next/image";
import { useState } from "react";
import type { Cuisine } from "@/lib/types/database";

type CuisineCarouselProps = {
  cuisines: Cuisine[];
};

export function CuisineCarousel({ cuisines }: CuisineCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = cuisines.length;
  const current = cuisines[index] ?? cuisines[0];

  if (!current) return null;

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
      <article className="overflow-hidden rounded-3xl bg-chefie-surface shadow-xl shadow-chefie-primary/15 ring-1 ring-stone-200/60">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={current.image_url}
            alt={current.name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 85vw, 400px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 right-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
            {current.name}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <NavButton label="Previous cuisine" onClick={goPrev}>
            <ChevronLeft />
          </NavButton>

          <div className="flex items-center gap-1.5">
            {cuisines.map((c, i) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Go to ${c.name}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-chefie-primary"
                    : "w-2 bg-stone-300 hover:bg-chefie-primary/50"
                }`}
              />
            ))}
          </div>

          <NavButton label="Next cuisine" onClick={goNext}>
            <ChevronRight />
          </NavButton>
        </div>
      </article>
    </div>
  );
}

function NavButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-chefie-bg-warm text-chefie-text transition-colors hover:bg-chefie-primary hover:text-white"
    >
      {children}
    </button>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
