import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { ThemeToggle } from "./components/ThemeToggle"
import MenubarWithSession from "@/components/MenubarWithSession"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Deep Track Inspect",
  description: "Inspect your Spotify tracks in depth",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <MenubarWithSession />
          {children}
        </Providers>
      </body>
    </html>
  )
}