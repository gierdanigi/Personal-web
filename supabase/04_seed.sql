-- =========================================================
-- 04_seed.sql : 초기 데이터
-- ⚠️ 아래 'you@example.com' 을 관리자 이메일(ADMIN_EMAIL)로 바꾼 뒤 실행하세요.
-- =========================================================

insert into public.admins (email)
values ('you@example.com')
on conflict (email) do nothing;

-- 프로필 1행 (관리자 페이지에서 수정)
insert into public.profile (id, name, nickname, headline, links, skills)
values (
  1,
  '이름',
  '닉네임',
  '영상 편집과 웹 개발을 합니다.',
  '[
    {"key": "github",   "label": "GitHub",   "value": "https://github.com/gierdanigi"},
    {"key": "email",    "label": "Email",    "value": "you@example.com"},
    {"key": "openchat", "label": "오픈채팅", "value": "https://open.kakao.com/o/xxxx"},
    {"key": "discord",  "label": "디스코드", "value": "discord_id"}
  ]'::jsonb,
  '[
    {"group": "Backend",  "items": []},
    {"group": "Cloud",    "items": []},
    {"group": "Frontend", "items": ["Next.js", "TypeScript", "Tailwind CSS"]},
    {"group": "Video",    "items": ["Premiere Pro", "After Effects"]}
  ]'::jsonb
)
on conflict (id) do nothing;

-- 커미션 메뉴 초기값 (이미 데이터가 있으면 건너뜀)
insert into public.commission_menu (category, name, sort_order)
select v.category, v.name, v.sort_order
from (values
  ('video', '컷편집 · 쇼츠 · 클립',                    10),
  ('video', '가사 PV · 커버곡 MV',                      20),
  ('video', '방송용 대기 · 오프닝 · 엔딩 · 전환 영상',  30),
  ('video', '로고 · 이름 모션',                          40),
  ('video', '직캠 편집',                                 50),
  ('dev',   '방송 오버레이 · 채팅창 · 후원 알림 위젯',  10),
  ('dev',   '디스코드 봇',                               20),
  ('dev',   '개인 사이트 · 커미션 페이지 · 링크 모음',  30),
  ('dev',   '행사 · 부스용 웹',                          40),
  ('dev',   '움직이는 · 인터랙티브 배경화면',            50),
  ('dev',   '서버 · 배포 · 백엔드',                      60)
) as v(category, name, sort_order)
where not exists (select 1 from public.commission_menu);
