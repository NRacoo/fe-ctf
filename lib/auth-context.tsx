"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"

interface AuthContextType {
  user: any
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  loginAdmin: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => Promise<boolean>
  logout: () => void
  userProfiles: any[]
  isLoading:boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

interface ProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: ProviderProps) {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [userProfiles, setUserProfiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const api = process.env.NEXT_PUBLIC_API_URL

    async function login(username: string, password: string) {
        try {
        const res = await fetch(`${api}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            username,
            password,
            }),
        })

        const json = await res.json()
        if (!res.ok) return false

        setToken(json.access_token)
        setUser(json.result)

        Cookies.set("ctf_user", JSON.stringify(json.result))
        Cookies.set("token", json.access_token)


        return true
        } catch (err) {
        console.error(err)
        return false
        }
    }

    async function loginAdmin(username: string, password: string) {
        try {
        const res = await fetch(`${api}/auth/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            username: username,
            password,
            }),
        })

        const json = await res.json()
        if (!res.ok) return false

        setToken(json.access_token)
        setUser(json.result)

        Cookies.set("ctf_user", JSON.stringify(json.result))
        Cookies.set("token", json.access_token)

        return true
        } catch (err) {
        console.error(err)
        return false
        }
    }

    async function register(username: string, password: string) {
        try {
        const res = await fetch(`${api}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })

        const json = await res.json()
        if (!res.ok) return false

        return true
        } catch (err) {
        console.error(err)
        return false
        }
    }

    function logout () {
        setUser(null)
        setToken(null)
        Cookies.remove("token")
        Cookies.remove("ctf_user")
    }

    async function fetchCurrentUser(token: string) {
        try {
            const res = await fetch(`${api}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });

            if (!res.ok) {
            console.log("Token invalid, clearing...");
            Cookies.remove("token");
            return;
            }

            const json = await res.json();
            setUser(json);
        } catch (err) {
            console.error("Failed to fetch current user:", err);
        }
    }

    async function fetchUserProfiles() {
        try {
            const res = await fetch(`${api}/users`);
            const data = await res.json();
            setUserProfiles(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    }

    useEffect(() => {
        async function init () {
            try {
                
                const saved = Cookies.get("ctf_user")
                const savedToken = Cookies.get("token");
                if(savedToken) {
                    setToken(savedToken);
                    await fetchCurrentUser(savedToken);
                }
                if (saved) {
                setUser(JSON.parse(saved))
                }
               
                await fetchUserProfiles()
            } catch (error) {
                console.error("init error", error)
            }
            setIsLoading(false)
        }
        
        init()
    }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loginAdmin, userProfiles, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
