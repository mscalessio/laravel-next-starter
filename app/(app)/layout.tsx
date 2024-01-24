'use client'

import { useAuth } from "@/hooks/auth";
import Loading from "@/app/(app)/loading";

export default function Layout({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  const { user } = useAuth({ middleware: "auth" });

  if (!user) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {header}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
