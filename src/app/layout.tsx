"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased text-white`}>
        {isLoginPage ? (
          children
        ) : (
          <div className="flex h-screen overflow-hidden bg-dark-200">
            <Sidebar />
            <div className="flex-1 flex flex-col relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none" />
              <Header />
              <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 w-full">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
