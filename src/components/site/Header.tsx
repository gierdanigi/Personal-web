import Link from "next/link";
import { getProfile } from "@/lib/queries";
import { ContactButtons } from "./SocialLinks";
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
        <NavLinks className="hidden md:flex" />
        <div className="ml-auto hidden md:block">
          <ContactButtons links={profile.links} size="sm" />
        </div>
        <MobileMenu className="ml-auto md:hidden">
          <ContactButtons links={profile.links} size="md" className="mt-4" />
        </MobileMenu>
      </div>
    </header>
  );
}
