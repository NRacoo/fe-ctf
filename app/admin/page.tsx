

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import LoginScreen from "@/components/layout/auth/login"
import Desktop from "@/components/ui/dekstop"
import Taskbar from "@/components/ui/taskbar"
import WindowManager from "@/components/ui/window-manager"
import Image from "next/image"
import { useRouter } from "next/navigation"

export type WindowType = "leaderboard" | "challenges" |  "about" | "admin" | null

export interface WindowState {
  type: WindowType
  isMinimized: boolean
  zIndex: number
  position: { x: number; y: number }
}

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [windows, setWindows] = useState<WindowState[]>([
    { type: "leaderboard", isMinimized: false, zIndex: 10, position: { x: 50, y: 30 } },
  ])
  const [activeWindow, setActiveWindow] = useState<WindowType>("leaderboard")
  const [maxZIndex, setMaxZIndex] = useState(10)

  const openWindow = (type: WindowType) => {
    const existingWindow = windows.find((w) => w.type === type)
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows((prev) =>
          prev.map((w) => (w.type === type ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w)),
        )
        setMaxZIndex((prev) => prev + 1)
      }
      bringToFront(type)
    } else {
      const offset = windows.length * 30
      setWindows((prev) => [
        ...prev,
        {
          type,
          isMinimized: false,
          zIndex: maxZIndex + 1,
          position: { x: 100 + offset, y: 50 + offset },
        },
      ])
      setMaxZIndex((prev) => prev + 1)
    }
    setActiveWindow(type)
  }

  const closeWindow = (type: WindowType) => {
    setWindows((prev) => prev.filter((w) => w.type !== type))
    if (activeWindow === type) {
      setActiveWindow(null)
    }
  }

  const minimizeWindow = (type: WindowType) => {
    setWindows((prev) => prev.map((w) => (w.type === type ? { ...w, isMinimized: true } : w)))
    if (activeWindow === type) {
      setActiveWindow(null)
    }
  }

  const toggleWindow = (type: WindowType) => {
    const win = windows.find((w) => w.type === type)
    if (!win) return

    if (win.isMinimized) {
      setWindows((prev) => prev.map((w) => (w.type === type ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w)))
      setMaxZIndex((prev) => prev + 1)
      setActiveWindow(type)
    } else {
      setWindows((prev) => prev.map((w) => (w.type === type ? { ...w, isMinimized: true } : w)))
      if (activeWindow === type) {
        setActiveWindow(null)
      }
    }
  }

  const bringToFront = (type: WindowType) => {
    setWindows((prev) => prev.map((w) => (w.type === type ? { ...w, zIndex: maxZIndex + 1 } : w)))
    setMaxZIndex((prev) => prev + 1)
    setActiveWindow(type)
  }

  const updatePosition = (type: WindowType, position: { x: number; y: number }) => {
    setWindows((prev) => prev.map((w) => (w.type === type ? { ...w, position } : w)))
  }

  useEffect(() => {
    if(!isLoading && !user){
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1e4d7b]">
        <div className="text-white text-xl">{isLoading ? "Loading..." : "Redirecting to Login..."}</div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={() => {}} />
  }

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden bg-[#1e4d7b]">
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
        src={"/image/frame.svg"}
        alt="logo"
        width={400}
        height={400}
        />
      </div>
      <Desktop openWindow={openWindow} />
      <WindowManager
        windows={windows}
        activeWindow={activeWindow}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onFocus={bringToFront}
        onUpdatePosition={updatePosition}
      />
      <Taskbar windows={windows} openWindow={openWindow} activeWindow={activeWindow} toggleWindow={toggleWindow} focusWindow={bringToFront} />
    </main>
  )
}
