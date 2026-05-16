import { Button } from "@/components/ui/button";

export default function ExplorePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-chefie-bg px-6">
      <h1 className="text-3xl font-bold text-chefie-text">Explore recipes</h1>
      <p className="mt-3 max-w-sm text-center text-chefie-muted">
        Recipe search and results are coming next in the roadmap.
      </p>
      <Button href="/" variant="primary" className="mt-8">
        Back home
      </Button>
    </div>
  );
}
