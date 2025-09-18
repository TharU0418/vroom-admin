"use client";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import NextTopLoader from "nextjs-toploader";
import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayoutWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { user, loading } = useAuth(); // assume `loading` is available in useAuth

  const isAuthPage = pathname === "/signin";

  useEffect(() => {
    setIsClient(true);

    // If user is not logged in and not already on the signin page, redirect
    if (!loading && !user && !isAuthPage) {
      router.push("/signin");
    }
  }, [user, loading, isAuthPage, router]);

  // Optional: show a loader while checking auth state
  if (!isClient || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <span>Loading...</span>
      </div>
    );
  }

  // If the user is on the signin page, just render the page without sidebar/header
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <NextTopLoader color="#5750F1" showSpinner={false} />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="w-full bg-gray-2 dark:bg-[#aa3131]">
          <Header />
          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
