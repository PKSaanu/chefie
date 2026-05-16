import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-chefie-bg px-6">
      <h1 className="text-3xl font-bold text-chefie-text">Sign in</h1>
      <p className="mt-3 max-w-sm text-center text-chefie-muted">
        Authentication coming soon. Continue exploring recipes on the home page.
      </p>
      <Button href="/" variant="primary" className="mt-8">
        Back home
      </Button>
    </div>
  );
}
