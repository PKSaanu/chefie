import Image from "next/image";
import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-[#fffaf7] via-chefie-bg to-chefie-bg-warm">
      <div className="home-orb home-orb--1 opacity-60" aria-hidden />
      <div className="home-orb home-orb--2 opacity-50" aria-hidden />

      <header className="relative z-10 px-6 py-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Chefie"
            width={110}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-chefie-text sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-chefie-muted">{subtitle}</p>
        </div>

        <div className="w-full max-w-md rounded-3xl bg-chefie-surface/90 p-8 shadow-xl shadow-chefie-primary/10 ring-1 ring-stone-200/70 backdrop-blur-sm">
          {children}
        </div>

        <Link
          href="/"
          className="mt-8 text-sm font-medium text-chefie-muted transition-colors hover:text-chefie-primary"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
