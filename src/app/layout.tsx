import "./globals.css";
import { QueryProvider } from "@/ui/queryClient";
import { DarkModeToggle } from "@/ui/components/DarkModeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <QueryProvider>
          <header className="border-b border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between">
            <div className="font-semibold">AI Sessions</div>
            <DarkModeToggle />
          </header>

          <main className="p-4 max-w-3xl mx-auto">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}