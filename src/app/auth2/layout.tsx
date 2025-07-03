// app/auth2/layout.tsx
import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
