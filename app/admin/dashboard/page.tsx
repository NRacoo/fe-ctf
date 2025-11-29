"use client"

import { Monitor, Flag, Trophy, Upload, HelpCircle, Settings } from "lucide-react"
import type { WindowType } from "@/app/page"
import { useAuth } from "../../../lib/auth-context"

interface DesktopProps {
  openWindow: (type: WindowType) => void
}

export default function Desktop({ openWindow }: DesktopProps) {
  const { user } = useAuth()

  const desktopIcons = [
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, type: "leaderboard" as WindowType },
    { id: "challenges", label: "Challenges", icon: Flag, type: "challenges" as WindowType },
    { id: "about", label: "About CTF", icon: HelpCircle, type: "about" as WindowType },
    ...(user?.role === "admin"
      ? [{ id: "admin", label: "Admin Panel", icon: Settings, type: "admin" as WindowType }]
      : []),
  ]

  return (
    <div className="flex-1 p-4 relative">
      <div className="flex flex-col gap-2">
        {desktopIcons.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center w-20 p-2 rounded hover:bg-white/20 focus:bg-white/30 transition-colors group"
            onDoubleClick={() => openWindow(item.type)}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-blue-400 to-blue-600 rounded shadow-lg">
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-xs mt-1 text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] select-none">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
