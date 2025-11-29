"use client"

import type { WindowType, WindowState } from "@/app/page"
import WindowFrame from "./window-frame"
import LeaderboardWindow from "../layout/leaderboard"
import ChallengesWindow from "../layout/challenge"
import AboutWindow from "../layout/about-window"
import AdminWindow from "../layout/admin-window"

interface WindowManagerProps {
  windows: WindowState[]
  activeWindow: WindowType
  onClose: (type: WindowType) => void
  onMinimize: (type: WindowType) => void
  onFocus: (type: WindowType) => void
  onUpdatePosition: (type: WindowType, position: { x: number; y: number }) => void
}

const windowSizes: Record<string, { width: number; height: number }> = {
  leaderboard: { width: 700, height: 500 },
  challenges: { width: 800, height: 550 },
  about: { width: 500, height: 400 },
  admin: { width: 900, height: 550 },
}

const windowTitles: Record<string, string> = {
  leaderboard: "Leaderboard - CA CTF",
  challenges: "Challenges",
  about: "About - CTF",
  admin: "Admin Panel - Challenge Manager",
}

export default function WindowManager({
  windows,
  activeWindow,
  onClose,
  onMinimize,
  onFocus,
  onUpdatePosition,
}: WindowManagerProps) {
  const renderWindowContent = (type: WindowType) => {
    switch (type) {
      case "leaderboard":
        return <LeaderboardWindow />
      case "challenges":
        return <ChallengesWindow />
      case "about":
        return <AboutWindow />
      case "admin":
        return <AdminWindow />
      default:
        return null
    }
  }

  return (
    <>
      {windows.map((win) => {
        if (!win.type || win.isMinimized) return null
        const size = windowSizes[win.type]
        return (
          <WindowFrame
            key={win.type}
            title={windowTitles[win.type]}
            isActive={activeWindow === win.type}
            position={win.position}
            size={size}
            zIndex={win.zIndex}
            onClose={() => onClose(win.type)}
            onMinimize={() => onMinimize(win.type)}
            onFocus={() => onFocus(win.type)}
            onUpdatePosition={(pos) => onUpdatePosition(win.type, pos)}
          >
            {renderWindowContent(win.type)}
          </WindowFrame>
        )
      })}
    </>
  )
}
