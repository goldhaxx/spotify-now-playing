import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/options"
import SessionProvider from "@/components/SessionProvider"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ModeToggle } from "@/components/ModeToggle"

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <div className="min-h-screen flex flex-col">
              <header className="p-4 flex justify-end">
                <ModeToggle />
              </header>
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}