"use client";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import NextTopLoader from "nextjs-toploader";
import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AuthLayoutWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthPage = pathname === "/auth2/sign-in";
  
  if (!isClient) {
    // Render minimal layout during SSR
    return (
      <div className="flex min-h-screen">
        <div className="w-full bg-gray-2 dark:bg-[#aa3131]">
          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <NextTopLoader color="#5750F1" showSpinner={false} />
      
      {isAuthPage ? (
        <div className="flex min-h-screen">
          <div className="w-full bg-gray-2 dark:bg-[#aa3131]">
            <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="w-full bg-gray-2 dark:bg-[#aa3131]">
            <Header />
            <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}