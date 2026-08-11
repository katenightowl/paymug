import Link from "next/link";
import { AppIcon } from "./dashboard/Icon";

export function Logo({
  href = "/",
  light = false,
  size = "md",
}: {
  href?: string;
  light?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const text =
    size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";
  const lemon =
    size === "sm" ? "h-6 w-6" : size === "lg" ? "h-9 w-9" : "h-7 w-7";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-bold tracking-tight ${text} ${light ? "text-white" : "text-foreground"}`}
    >
      <AppIcon size={28} />
      Paymug
    </Link>
  );
}
