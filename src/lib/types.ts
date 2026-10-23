export type Category = "video" | "dev";

export const CATEGORY_LABEL: Record<Category, string> = {
  video: "영상",
  dev: "개발",
};

export type LinkItem = { key: string; label: string; value: string };
export type SkillGroup = { group: string; items: string[] };
export type Certification = { name: string; date: string };
export type Activity = { name: string; period: string; description: string };
export type ImageItem = { path: string; url: string; caption: string };
export type EtcLink = { label: string; url: string };

export type Profile = {
  id: 1;
  name: string;
  nickname: string;
  headline: string;
  bio: string;
  avatar_url: string | null;
  school: string;
  major: string;
  status: string;
  links: LinkItem[];
  skills: SkillGroup[];
  certifications: Certification[];
  activities: Activity[];
  updated_at?: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  period_start: string | null;
  period_end: string | null;
  is_ongoing: boolean;
  team_info: string;
  role: string;
  tech_stack: string[];
  description: string;
  images: ImageItem[];
  github_url: string | null;
  demo_url: string | null;
  etc_links: EtcLink[];
  is_featured: boolean;
  is_public: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type CommissionMenu = {
  id: string;
  category: Category;
  name: string;
  description: string;
  price_text: string;
  duration_text: string;
  revision_text: string;
  sort_order: number;
  is_open: boolean;
};

export type Work = {
  id: string;
  title: string;
  slug: string;
  category: Category;
  menu_id: string | null;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  video_url: string | null;
  demo_url: string | null;
  description: string;
  tools: string[];
  work_date: string | null;
  is_featured: boolean;
  is_public: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type WorkWithMenu = Work & {
  menu: Pick<CommissionMenu, "id" | "name"> | null;
};

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export const EMPTY_PROFILE: Profile = {
  id: 1,
  name: "",
  nickname: "",
  headline: "",
  bio: "",
  avatar_url: null,
  school: "",
  major: "",
  status: "",
  links: [],
  skills: [],
  certifications: [],
  activities: [],
};
