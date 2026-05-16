import { ChipLink } from "@/components/ui/chip-link";
import { Button } from "@/components/ui/button";

export function QuickActions({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChipLink href="/meal-planning" icon={<CalendarIcon />}>
          Meal planning
        </ChipLink>
        <ChipLink href="/ingredients" icon={<PantryIcon />}>
          What you have
        </ChipLink>
      </div>

      <Button href="/explore" size="lg" className="w-full sm:w-auto">
        Explore recipes
        <ArrowIcon />
      </Button>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 text-chefie-primary"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PantryIcon() {
  return (
    <svg
      className="h-4 w-4 text-chefie-primary"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 6h15l-1.5 9H7.5L6 6zM6 6L5 3H2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
