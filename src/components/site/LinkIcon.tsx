import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiKakaotalk,
  SiNaver,
  SiNotion,
  SiTistory,
  SiTwitch,
  SiVelog,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { Globe, Link2, Mail, PenLine } from "lucide-react";

const ICONS: Record<string, IconType | typeof Globe> = {
  github: SiGithub,
  blog: PenLine,
  velog: SiVelog,
  tistory: SiTistory,
  x: SiX,
  youtube: SiYoutube,
  instagram: SiInstagram,
  twitch: SiTwitch,
  chzzk: SiNaver,
  linkedin: FaLinkedinIn,
  notion: SiNotion,
  email: Mail,
  openchat: SiKakaotalk,
  discord: SiDiscord,
  website: Globe,
};

export function LinkIcon({ name, className = "size-4" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? LinkIconFallback;
  return <Icon className={className} aria-hidden />;
}

function LinkIconFallback({ className }: { className?: string }) {
  return <Link2 className={className} aria-hidden />;
}
