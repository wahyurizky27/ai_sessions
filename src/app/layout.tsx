import "./globals.css";
import { QueryProvider } from "@/ui/queryClient";
import { DarkModeToggle } from "@/ui/components/DarkModeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100">
        <QueryProvider>
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="font-semibold text-lg">Chat Sessions</span>
              </div>
              <DarkModeToggle />
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}