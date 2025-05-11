import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Library Management System",
  description: "A modern library management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {/* Mobile Navigation Toggle - Only visible on small screens */}
          <MobileNav />

          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div
            className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0 -translate-x-full"
            id="sidebar"
          >
            <div className="flex flex-col h-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary">Library MS</h2>
              </div>
              <nav className="flex-1 px-4 space-y-2">
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-sm rounded-md transition-colors hover:bg-muted"
                >
                  <span className="mr-3">📊</span>
                  Dashboard
                </Link>
                <Link
                  href="/books"
                  className="flex items-center px-4 py-3 text-sm rounded-md transition-colors hover:bg-muted"
                >
                  <span className="mr-3">📚</span>
                  Books
                </Link>
                <Link
                  href="/users"
                  className="flex items-center px-4 py-3 text-sm rounded-md transition-colors hover:bg-muted"
                >
                  <span className="mr-3">👥</span>
                  Users
                </Link>
                <Link
                  href="/issue-return"
                  className="flex items-center px-4 py-3 text-sm rounded-md transition-colors hover:bg-muted"
                >
                  <span className="mr-3">🔄</span>
                  Issue & Return
                </Link>
              </nav>
              <div className="p-6">
                <p className="text-xs text-muted-foreground">© 2025 Library Management System</p>
              </div>
            </div>
          </div>

          {/* Main Content - Adjusted for sidebar */}
          <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64 w-full transition-all duration-300 ease-in-out">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
