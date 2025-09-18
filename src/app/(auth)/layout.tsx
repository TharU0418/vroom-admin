
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen w-full justify-between font-inter fixed">


      {children}
    </main>
  );
}
