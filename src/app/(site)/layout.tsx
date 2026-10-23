import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-8 sm:px-6 sm:pt-12">{children}</main>
      <Footer />
    </>
  );
}
