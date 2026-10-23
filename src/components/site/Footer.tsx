import Link from "next/link";
import { getProfile } from "@/lib/queries";
import { ContactButtons, SocialLinks } from "./SocialLinks";
import { NAV_ITEMS } from "@/lib/nav";

export async function Footer() {
  const profile = await getProfile();
  const siteName = profile.nickname || profile.name || "Portfolio";

  return (
    <footer className="mt-20 border-t border-line bg-card">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-lg font-bold">{siteName}</p>
          {profile.headline && <p className="mt-1 text-sm text-muted">{profile.headline}</p>}
          <SocialLinks links={profile.links} className="mt-4" />
        </div>
        <div className="md:text-right">
          <p className="text-sm font-semibold">문의</p>
          <ContactButtons links={profile.links} size="sm" className="mt-3 md:justify-end" />
          <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted md:justify-end">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        © {siteName}. All rights reserved.
      </p>
    </footer>
  );
}
