import { Button } from "@/components/ui/button";

export default function MealPlanningPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-chefie-bg px-6">
      <h1 className="text-3xl font-bold text-chefie-text">Meal planning</h1>
      <p className="mt-3 max-w-sm text-center text-chefie-muted">
        Calendar meal planning is on the roadmap — this page is a placeholder.
      </p>
      <Button href="/" variant="primary" className="mt-8">
        Back home
      </Button>
    </div>
  );
}
