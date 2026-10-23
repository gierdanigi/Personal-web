# Personal Web — 영상 편집 · 웹 개발 포트폴리오 & 커미션

개발자 포트폴리오와 커미션 안내를 겸하는 개인 사이트입니다.
프로필, 프로젝트, 작업물, 커미션 메뉴를 **관리자 페이지(`/admin`)에서 직접 수정**하며, 저장하면 재배포 없이 바로 반영됩니다.

- **스택**: Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Supabase (Postgres · Storage · Auth) · Vercel
- **페이지**: `/` · `/about` · `/projects` · `/projects/[slug]` · `/works` · `/works/[slug]` · `/commission` · `/admin`

---

## 폴더 구조

```
supabase/                 # Supabase SQL Editor에서 순서대로 실행
  01_schema.sql           # 테이블 · 인덱스 · updated_at 트리거
  02_rls.sql              # RLS 정책 + is_admin()
  03_storage.sql          # media 버킷 + 스토리지 정책
  04_seed.sql             # 관리자 이메일 · 프로필 1행 · 커미션 메뉴 초기값
src/
  app/
    (site)/               # 공개 페이지 (헤더 · 푸터 레이아웃)
    admin/login/          # 관리자 로그인
    admin/(panel)/        # 관리자 페이지 (프로필 · 프로젝트 · 작업물 · 커미션 메뉴)
    opengraph-image.tsx   # 기본 OG 이미지 (프로젝트 · 작업물 상세는 각자 생성)
    sitemap.ts, robots.ts
  actions/                # Server Actions (저장 · 삭제 · 순서 변경 · 공개 토글)
  components/
    site/                 # 공개 페이지 컴포넌트
    admin/                # 관리자 폼 · 이미지 업로드 · 드래그 정렬 · 마크다운 편집기
  lib/
    queries.ts            # 공개 데이터 조회 (캐시됨)
    admin-queries.ts      # 관리자 데이터 조회 (비공개 포함, 캐시 안 함)
    auth.ts               # requireAdmin()
    supabase/             # 서버 · 브라우저 · 익명 클라이언트
  proxy.ts                # /admin 세션 갱신 · 비로그인 리다이렉트 (Next 16의 middleware)
```

---

## 1. Supabase 세팅

### 1-1. 프로젝트 만들기
[supabase.com](https://supabase.com)에서 새 프로젝트를 만들어요. 리전은 `Northeast Asia (Seoul)`을 추천해요.

### 1-2. SQL 실행
**SQL Editor**에서 `supabase/` 폴더의 파일을 **01 → 02 → 03 → 04 순서로** 붙여 넣고 실행해요.

> ⚠️ `04_seed.sql`은 실행하기 전에 `you@example.com`을 **관리자 이메일로 바꿔** 주세요.
> 쓰기 권한은 이 `admins` 테이블의 이메일로 판단해요 (DB 레벨 보안).

나중에 관리자 이메일을 바꾸려면 SQL Editor에서:
```sql
delete from public.admins;
insert into public.admins (email) values ('new@example.com');
```
그리고 환경변수 `ADMIN_EMAIL`도 함께 바꿔요.

### 1-3. 관리자 계정 만들기 · 회원가입 막기
1. **Authentication → Sign In / Providers**
   - `Email` 공급자가 켜져 있는지 확인
   - **`Allow new users to sign up` 끄기** ← 회원가입 차단
2. **Authentication → Users → Add user → Create new user**
   - 관리자 이메일 · 비밀번호 입력, `Auto Confirm User` 체크
3. **Authentication → URL Configuration**
   - `Site URL`을 배포 주소(예: `https://your-site.vercel.app`)로 설정

### 1-4. API 키 확인
**Project Settings → API Keys**에서 `Project URL`과 **publishable key**(`sb_publishable_...`)를 복사해요.
예전 방식의 `anon` key를 써도 돼요 (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
`service_role` / `secret` key는 **쓰지 않아요.** 모든 쓰기는 로그인한 관리자 세션 + RLS로 처리돼요.

---

## 2. 환경변수

`.env.example`을 복사해 `.env.local`을 만들어요.

| 이름 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | publishable key (또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`) |
| `ADMIN_EMAIL` | ✅ | 관리자 이메일. `admins` 테이블과 같아야 해요 |
| `NEXT_PUBLIC_SITE_URL` | 권장 | 사이트 주소. OG 이미지 · sitemap에 쓰여요. Vercel에서는 비우면 프로덕션 도메인을 자동으로 써요 |

---

## 3. 로컬 실행

Node.js 20.9 이상이 필요해요.

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin → 1-3에서 만든 계정으로 로그인

프로덕션 빌드 확인:
```bash
npm run build && npm start
```

> Supabase 환경변수가 없어도 빌드와 실행은 돼요 (빈 사이트로 보임).

---

## 4. Vercel 배포

1. [vercel.com](https://vercel.com) → **Add New → Project** → 이 GitHub 레포 Import
2. Framework는 자동으로 `Next.js`
3. **Environment Variables**에 위 표의 값을 넣어요 (Production · Preview 모두)
4. **Deploy**
5. 배포 주소를 Supabase **Authentication → URL Configuration → Site URL**에 넣어요
6. 커스텀 도메인을 연결했다면 `NEXT_PUBLIC_SITE_URL`도 그 주소로 바꾸고 재배포해요

> `NEXT_PUBLIC_SUPABASE_URL`은 빌드할 때 이미지 도메인 허용 목록(`next.config.ts`)에도 쓰여요.
> 이 값을 바꾸면 **재배포**가 필요해요.

이후로는 `main`에 push할 때마다 자동으로 배포돼요. **콘텐츠 수정은 재배포가 필요 없어요.**

---

## 사용법 (관리자)

| 메뉴 | 할 수 있는 것 |
|---|---|
| 프로필 | 이름 · 닉네임 · 한 줄 소개 · 아바타 · 학력 · 상세 소개(마크다운) · 링크 · 기술 스택 · 자격증 · 활동 |
| 프로젝트 | 추가 · 수정 · 삭제, 이미지 여러 장(첫 장이 대표), 마크다운 본문, 공개 / 메인 노출(★) 토글, 드래그로 순서 변경 |
| 작업물 | 영상 / 개발 카테고리, 커미션 메뉴(세부 분류) 연결, 유튜브 링크(썸네일 자동), 공개 / 메인 노출 토글, 순서 변경 |
| 커미션 메뉴 | 메뉴 추가 · 수정 · 삭제, 가격 · 기간 · 수정 횟수, 접수 중 / 마감 토글, 순서 변경 |

- **문의 버튼**: 프로필 링크에 `오픈채팅` · `디스코드`를 추가하면 헤더 · 푸터 · 커미션 페이지에 자동으로 표시돼요. 디스코드에 URL이 아닌 아이디를 적으면 클릭 시 복사돼요.
- **slug**: 주소에 쓰이는 영문 이름(`/projects/my-project`). 영문 소문자 · 숫자 · 하이픈만 가능해요. 영문 제목이면 자동으로 추천돼요.
- **메인 노출**: ★로 지정한 항목만 메인에 나와요. 하나도 지정하지 않으면 최신순으로 채워요.
- **이미지**: 업로드할 때 브라우저에서 최대 2000px · webp로 줄여서 올려요 (gif는 그대로). 항목을 삭제하거나 이미지를 빼고 저장하면 Storage에서도 지워져요.

---

## 동작 방식

### 바로 반영 (재배포 없음)
공개 페이지는 `'use cache'` + `cacheTag`로 정적으로 캐시되고 (`profile` · `projects` · `works` · `menu` 태그),
관리자가 저장하면 Server Action에서 `updateTag()`로 해당 태그만 무효화해요. 다음 방문부터 새 내용이 보여요.
혹시 모를 경우에 대비해 캐시는 하루마다 자동으로도 갱신돼요.

### 보안
- **DB (RLS)**: 공개 읽기는 `is_public = true`인 프로젝트 · 작업물만, 프로필 · 커미션 메뉴는 전체 공개. 쓰기는 `is_admin()`(= `admins` 테이블 이메일)만.
- **Storage**: `media` 버킷은 공개 읽기, 업로드 · 삭제는 `is_admin()`만.
- **앱**: `proxy.ts`가 비로그인 사용자를 `/admin/login`으로 보내고, 모든 관리자 페이지와 Server Action이 `requireAdmin()`으로 `ADMIN_EMAIL`을 다시 확인해요.
- 회원가입은 Supabase에서 꺼 둬요 (1-3).
- 마크다운은 `rehype-sanitize`로 걸러서 렌더링해요 (HTML · 스크립트 차단).

### SEO
- 페이지별 `title` · `description`, 한국어 `lang`
- OG 이미지: 기본 이미지 + 프로젝트 · 작업물별 이미지 자동 생성 (`next/og`, 한글 폰트 포함)
- `sitemap.xml` · `robots.txt` (`/admin` 제외)
