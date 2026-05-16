import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.username as string | undefined) ??
    user?.email?.split("@")[0] ??
    null;

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-5 md:px-10 lg:px-12">
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        <Image
          src="/logo.png"
          alt="Chefie"
          width={110}
          height={36}
          className="h-8 w-auto object-contain md:h-9"
          priority
        />
      </Link>

      {user ? (
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[140px] truncate text-sm font-medium text-chefie-muted sm:inline">
            Hi, {displayName}
          </span>
          <form action={signOut}>
            <Button type="submit" variant="secondary" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button href="/signup" variant="primary" size="sm">
            Sign up
          </Button>
        </div>
      )}
    </header>
  );
}
