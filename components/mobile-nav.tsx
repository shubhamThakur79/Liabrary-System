"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar")
    if (sidebar) {
      sidebar.classList.toggle("-translate-x-full")
      setIsOpen(!isOpen)

      // Add/remove overlay when sidebar is open/closed
      if (!isOpen) {
        const overlay = document.createElement("div")
        overlay.id = "sidebar-overlay"
        overlay.className = "fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        overlay.addEventListener("click", toggleSidebar)
        document.body.appendChild(overlay)
        document.body.style.overflow = "hidden" // Prevent scrolling when sidebar is open
      } else {
        const overlay = document.getElementById("sidebar-overlay")
        if (overlay) {
          document.body.removeChild(overlay)
          document.body.style.overflow = "" // Re-enable scrolling
        }
      }
    }
  }

  // Update active link in sidebar based on current path
  useEffect(() => {
    const links = document.querySelectorAll("#sidebar nav a")
    links.forEach((link) => {
      const href = link.getAttribute("href")
      if (href === "/" && pathname === "/") {
        link.classList.add("nav-link-active")
      } else if (href !== "/" && pathname.startsWith(href || "")) {
        link.classList.add("nav-link-active")
      } else {
        link.classList.remove("nav-link-active")
      }
    })
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar")
      const target = event.target as HTMLElement

      if (isOpen && sidebar && !sidebar.contains(target) && !target.closest(".mobile-menu-button")) {
        sidebar.classList.add("-translate-x-full")
        setIsOpen(false)

        // Remove overlay
        const overlay = document.getElementById("sidebar-overlay")
        if (overlay) {
          document.body.removeChild(overlay)
          document.body.style.overflow = "" // Re-enable scrolling
        }
      }
    }

    // Close sidebar when screen size changes to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        const sidebar = document.getElementById("sidebar")
        if (sidebar) {
          sidebar.classList.add("-translate-x-full")
          setIsOpen(false)

          // Remove overlay
          const overlay = document.getElementById("sidebar-overlay")
          if (overlay) {
            document.body.removeChild(overlay)
            document.body.style.overflow = "" // Re-enable scrolling
          }
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("resize", handleResize)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleResize)
    }
  }, [isOpen])

  return (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="mobile-menu-button bg-background shadow-md h-10 w-10"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  )
}
