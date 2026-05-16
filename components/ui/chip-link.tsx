import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ChipLinkProps = ComponentPropsWithoutRef<"button"> & {
  href?: string;
  icon?: ReactNode;
  children: ReactNode;
};

export function ChipLink({
  href,
  icon,
  children,
  className = "",
  ...props
}: ChipLinkProps) {
  const classes = [
    "inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-chefie-surface/90 px-4 py-2.5 text-sm font-medium text-chefie-text shadow-sm backdrop-blur-sm transition-all hover:border-chefie-primary/50 hover:shadow-md hover:shadow-chefie-primary/10",
    className,
  ].join(" ");

  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
