
export default function ShopLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <main className="flex justify-center min-h-screen">
      <div className="w-full sm:w-87.5 px-10">
        {children}
      </div>
    </main>
  );
}