import Link from "next/link";
import { getProfile } from "@/lib/queries";
import { MobileMenu, NavLinks } from "./NavLinks";

export async function Header() {
  const profile = await getProfile();
  const siteName = profile.nickname || profile.name || "Portfolio";

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
          {siteName}
        </Link>
        <NavLinks className="ml-auto hidden md:flex" />
        <MobileMenu className="ml-auto md:hidden" />
      </div>
    </header>
  );
}
