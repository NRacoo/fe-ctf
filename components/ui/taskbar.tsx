"use client"

import { useState, useEffect } from "react"
import {
  Trophy,
  Flag,
  Upload,
  HelpCircle,
  Terminal,
  Wifi,
  Volume2,
  ChevronUp,
  Settings,
  LogOut,
  User,
} from "lucide-react"
import type { WindowType, WindowState } from "@/app/page"
import { useAuth } from "../../lib/auth-context"

interface TaskbarProps {
  windows: WindowState[]
  openWindow: (type: WindowType) => void
  activeWindow: WindowType
  toggleWindow: (type: WindowType) => void
  focusWindow: (type: WindowType) => void
}

const windowIcons: Record<string, any> = {
  leaderboard: Trophy,
  challenges: Flag,
  about: HelpCircle,
  admin: Settings,
}

const windowTitles: Record<string, string> = {
  leaderboard: "Leaderboard",
  challenges: "Challenges",
  about: "About CTF",
  admin: "Admin Panel",
}

export default function Taskbar({ windows, openWindow, activeWindow, toggleWindow, focusWindow }: TaskbarProps) {
  const { user, logout} = useAuth()
  const [time, setTime] = useState(new Date())
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleTaskbarClick = (win: WindowState) => {
    if (!win.type) return

    if (win.isMinimized) {
      toggleWindow(win.type)
    } else if (activeWindow === win.type) {
      toggleWindow(win.type)
    } else {
      focusWindow(win.type)
    }
  }

  return (
    <div className="h-10 bg-linear-to-b from-[#2d4f6e] to-[#1e3a52] border-t border-[#4a7aa8] flex items-center px-1">
      {/* Start Button */}
      <button className="h-8 px-3 flex items-center gap-2 bg-linear-to-b from-[#378de5] to-[#1a5a8e] hover:from-[#4a9de8] hover:to-[#2a6a9e] rounded-sm border border-[#5a9ad5] text-white text-sm font-semibold shadow-inner">
        <Terminal className="w-4 h-4" />
        <span>CyberAcademy</span>
      </button>

      {/* Window buttons */}
      <div className="flex-1 flex items-center gap-1 px-2">
        {windows.map((win) => {
          if (!win.type) return null
          const Icon = windowIcons[win.type]
          const isActive = activeWindow === win.type && !win.isMinimized
          return (
            <button
              key={win.type}
              onClick={() => handleTaskbarClick(win)}
              className={`h-8 px-3 flex items-center gap-2 rounded-sm text-white text-xs transition-all min-w-[140px] max-w-[200px] ${
                isActive
                  ? "bg-linear-to-b from-[#5a9ad5]/40 to-[#3a7ab5]/40 border border-[#8ac0e8]/50 shadow-inner"
                  : "bg-linear-to-b from-white/10 to-white/5 border border-white/10 hover:bg-white/20"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{windowTitles[win.type]}</span>
            </button>
          )
        })}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-1 px-2 border-l border-[#4a7aa8]/50">
        <button className="p-1 hover:bg-white/10 rounded">
          <ChevronUp className="w-3 h-3 text-white/70" />
        </button>
        <div className="flex items-center gap-2 px-2">
          <Wifi className="w-4 h-4 text-white/80" />
          <Volume2 className="w-4 h-4 text-white/80" />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded"
          >
            <div className="w-5 h-5 rounded-full bg-[#4a90c2] flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-white text-xs">{user?.username}</span>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full right-0 mb-1 w-48 bg-[#f0f0f0] border border-[#888] shadow-lg">
              <div className="p-2 border-b border-[#d0d0d0]">
                <div className="text-sm font-semibold text-gray-800">{user?.username}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
                <div className="text-xs text-blue-600 mt-1">{user?.role === "admin" ? "Administrator" : "Player"}</div>
              </div>
              <button
                onClick={() => {
                  logout()
                  setShowUserMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-[#cce8ff] flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>

        <div className="text-white text-xs px-2 py-1 hover:bg-white/10 rounded flex flex-col items-end">
          <span>{time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
          <span className="text-[10px] text-white/70">{time.toLocaleDateString("id-ID")}</span>
        </div>
      </div>
    </div>
  )
}