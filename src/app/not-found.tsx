import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-xl font-bold">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-sm text-muted">주소가 바뀌었거나 비공개로 전환된 페이지일 수 있어요.</p>
      <Link href="/" className="btn-primary mt-8">
        홈으로
      </Link>
    </main>
  );
}
