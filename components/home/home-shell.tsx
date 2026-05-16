import { Header } from "@/components/home/header";
import { CuisineCarousel } from "@/components/home/cuisine-carousel";
import { QuickActions } from "@/components/home/quick-actions";
import type { Cuisine } from "@/lib/types/database";

type HomeShellProps = {
  cuisines: Cuisine[];
};

export function HomeShell({ cuisines }: HomeShellProps) {
  return (
    <div className="home-page relative h-dvh w-full overflow-hidden">
      <div className="home-orb home-orb--1" aria-hidden />
      <div className="home-orb home-orb--2" aria-hidden />

      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col">
        <Header />

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 md:px-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-12 lg:pb-10">
          <section className="flex min-h-0 flex-col lg:py-4">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-chefie-surface/80 px-3 py-1.5 text-xs font-semibold text-chefie-primary shadow-sm ring-1 ring-chefie-primary/20 backdrop-blur-sm">
              <MicIcon />
              Voice-powered cooking
            </div>

            <h1 className="max-w-xl text-3xl font-extrabold leading-[1.15] tracking-tight text-chefie-text sm:text-4xl lg:text-5xl">
              Cook smarter with your{" "}
              <span className="text-gradient">personal kitchen</span> assistant
            </h1>

            <p className="mt-3 max-w-md text-base leading-relaxed text-chefie-muted">
              Browse cuisines, plan meals, and get step-by-step guidance —
              hands-free while you cook.
            </p>

            <div className="mt-6 flex min-h-0 flex-1 items-center justify-center lg:mt-8 lg:justify-start">
              <CuisineCarousel cuisines={cuisines} />
            </div>
          </section>

          <section className="mt-auto shrink-0 lg:mt-0 lg:flex lg:flex-col lg:justify-center">
            <div className="hidden rounded-3xl bg-chefie-surface/70 p-6 shadow-lg ring-1 ring-stone-200/60 backdrop-blur-md lg:block">
              <h2 className="text-lg font-bold text-chefie-text">
                Start your next meal
              </h2>
              <p className="mt-1 text-sm text-chefie-muted">
                Jump in with a quick action below.
              </p>
              <QuickActions className="mt-5" />
            </div>

            <div className="lg:hidden">
              <QuickActions />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="9"
        y="2"
        width="6"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 10a7 7 0 0014 0M12 17v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
