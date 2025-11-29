"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Wifi, Settings, Power, ArrowRight, UserPlus, Loader2 } from "lucide-react"
import { useAuth } from "../../../lib/auth-context"
import LoginForm from "./loginForm"
import RegisterForm from "./registerForm"

interface LoginScreenProps {
  onLogin: () => void
}

type Mode = "select" | "login" | "register"


export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const { login, register, userProfiles } = useAuth()
  const [mode, setMode] = useState<Mode>("select")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId)
    setMode("login")
    setError("")
  }

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields")
      return
    }
    setIsLoading(true)
    setError("")
    const success = await login(username, password)
    setIsLoading(false)
    if (success) {
      onLogin()
    } else {
      setError("Invalid username or password")
    }
  }

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please fill in all fields")
      return
    }
    setIsLoading(true)
    setError("")
    const success = await register(username, password)
    setIsLoading(false)
    setMode("login")
    setSelectedUser("User")
    if (success) {
      onLogin()
    } else {
      setError("Username already exists")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (mode === "register") {
        handleRegister()
      } else {
        handleLogin()
      }
    }
  }

  return (
    <div
      className="h-screen w-screen flex flex-col relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #1a4a7a 0%, #0a2a4a 50%, #051525 100%)",
      }}
    >

      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30, 100, 180, 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 30% 70%, rgba(20, 80, 150, 0.3) 0%, transparent 50%)",
        }}
      />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="flex flex-col items-center">
          {/* User avatar */}
          <div className="w-40 h-40 rounded-full bg-linear-to-b from-[#4a90c2]/40 to-[#2d6da3]/40 border-4 border-[#4a90c2]/50 flex items-center justify-center mb-4 backdrop-blur-sm">
            <User className="w-24 h-24 text-[#4a90c2]" strokeWidth={1} />
          </div>

          {/* User name / Title */}
          <h1 className="text-white text-2xl font-light mb-6">
            
            {mode === "register"
              ? "Create Account"
              : selectedUser
            }
            
            
          </h1>

          {/* Login / Register Form */}
          {mode === "login" && (
            <LoginForm
             username={username}
             password={password}
             isLoading={isLoading}
             error={error}
             onUserChange={setUsername}
             onPasswordChange={setPassword}
             onKeyDown={handleKeyDown}
             onLogin={handleLogin}
             onBack={() => {
                setMode("select");
                setSelectedUser(null)
            }}
            onSwitch={() => setMode("register")}
            />
          )}

          {mode ==="register" && (
            <RegisterForm
            username={username}
            password={password}
            isLoading={isLoading}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onKeyDown={handleKeyDown}
            onRegister={handleRegister}
            error={error}
            onBack={() => {
                setMode("select")
                setSelectedUser(null)
            }}
            onSwitch={() => setMode("login")}
            />
          )

          }

          {/* User selection mode */}
          {mode === "select" && (
            <div className="flex gap-8 mt-4">
              <button
                onClick={() => handleUserSelect("User")}
                className="w-24 h-24 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#4a90c2]/30 flex items-center justify-center">
                  <User className="w-7 h-7 text-[#4a90c2]" />
                </div>
                <span className="text-white/80 text-xs">User</span>
              </button>
              <button
                onClick={() => setMode("register")}
                className="w-24 h-24 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/30 flex items-center justify-center">
                  <UserPlus className="w-7 h-7 text-green-400" />
                </div>
                <span className="text-white/80 text-xs">Register</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* System tray bottom right */}
      <div className="absolute bottom-4 right-4 flex items-center gap-4">
        <Wifi className="w-5 h-5 text-white/70" />
        <Settings className="w-5 h-5 text-white/70" />
        <Power className="w-5 h-5 text-white/70" />
      </div>

      {/* Time display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-white text-5xl font-light">
          {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="text-white/60 text-lg mt-1">
          {time.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>
    </div>
  )
}
