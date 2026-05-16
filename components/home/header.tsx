import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-5 md:px-10 lg:px-12">
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/logo.png"
          alt="Chefie"
          width={110}
          height={36}
          className="h-8 w-auto object-contain md:h-9"
          priority
        />
      </Link>
      <Button href="/login" variant="secondary" size="sm">
        Sign in
      </Button>
    </header>
  );
}
