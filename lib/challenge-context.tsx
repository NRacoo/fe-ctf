"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export interface Challenge {
  id: string
  title: string
  points: number
  solves: number
  solved: boolean
  description: string
  flag: string
}

interface ChallengesContextType {
  challenges: Challenge[]
  loading: boolean
  fetchChallenges: () => Promise<void>
  submitFlag: (challengeId: string, flag: string) => Promise<boolean>
  createChallenge: (dto: any) => Promise<boolean>
  deleteChallenge: (id: string) => Promise<boolean>
}

const ChallengesContext = createContext<ChallengesContextType | null>(null)

export function ChallengesProvider({ children }: { children: ReactNode }) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
const api = process.env.NEXT_PUBLIC_API_URL

  const { token } = useAuth()

  /** GET ALL CHALL */
  async function fetchChallenges() {
    try {
      setLoading(true)
      const res = await fetch(`${api}/challenges`)

      const data = await res.json()
      setChallenges(data.data ?? data)
    } catch (err) {
      console.error("Failed to fetch challenges:", err)
    } finally {
      setLoading(false)
    }
  }

  /** SUBMIT FLAG */
  async function submitFlag(challengeId: string, flag: string): Promise<boolean> {
    if (!token) return false

    try {
      const res = await fetch(`${api}/challenges/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId,
          flag,
        }),
      })

      const result = await res.json()

      if (!res.ok) return false

      await fetchChallenges() // refresh scoreboard
      return true
    } catch (err) {
      console.error("Failed to submit flag:", err)
      return false
    }
  }

  /** ADMIN – CREATE CHALLENGE */
  async function createChallenge(dto: any): Promise<boolean> {
    try {
      const res = await fetch(`${api}/challenges/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      })

      if (!res.ok) return false

      await fetchChallenges()

      return true
    } catch (err) {
      console.error("Failed to create challenge:", err)
      return false
    }
  }

  /** ADMIN – DELETE CHALLENGE */
  async function deleteChallenge(id: string): Promise<boolean> {
    try {
      const res = await fetch(
        `http://localhost:3002/challenges/admin/delete?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) return false

      await fetchChallenges()

      return true
    } catch (err) {
      console.error("Failed to delete challenge:", err)
      return false
    }
  }
  useEffect(() => {
    fetchChallenges()
  }, [])

  return (
    <ChallengesContext.Provider
      value={{
        challenges,
        loading,
        fetchChallenges,
        submitFlag,
        createChallenge,
        deleteChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  )
}

export function useChallenges() {
  const context = useContext(ChallengesContext)
  if (!context) throw new Error("useChallenges must be used within ChallengesProvider")
  return context
}
