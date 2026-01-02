import { Footer, Sidebar, TopMenu } from "@/components";

export default function ShopLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen md:px-5">
      <TopMenu />
      <Sidebar />
      <div className="md:px-5">
        {children}
      </div>
      <Footer />
    </main>
  );
}