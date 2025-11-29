"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Clock, RefreshCw } from "lucide-react"
import { io } from "socket.io-client"

interface TeamScore {
  id: string
  username: string
  score: number
  solves:number
  lastSolve: Date 
  rank: number
}

export default function LeaderboardWindow() {
  const [teams, setTeams] = useState<TeamScore[]>([])
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const api = process.env.NEXT_PUBLIC_API_URL 

  const fetchInitData = async () =>{
     try {
         const res = await fetch(`${api}/leaderboard`)
         const data = await res.json()

         const normalized = data.map((u: any) => ({
         id: u.id,
         username: u.username,
         score: u.score,
         solves: u.solves,
         rank: u.rank,
         lastSolve: u.lastSolve ? new Date(u.lastSolve) : null,
         }));
     setTeams(normalized);
     setLastUpdate(new Date())
         
     } catch (error) {
         console.error("Gagal mengambil data awal:", error);
     }finally{
        setIsRefreshing(false)
     }
  }
  useEffect(() => {
     fetchInitData()

     const socket = io(`${api}`, {
        transports:["websockets"],
        autoConnect:true
     })
     socket.on("connect", ()=>{
        console.log("Connected to WS: ID: ", socket.id)
     })
     socket.on("leaderboard_update", (data) => {
        console.log("Realtime Updated received:", data);
        const normalized = data.map((u : any) => ({
            id: u.id,
            username: u.username,
            score: u.score,
            solves: u.solves,
            rank: u.rank,
            lastSolve: u.lastSolve ? new Date(u.lastSolve) : null,
        }));
        setTeams(normalized);
        setLastUpdate(new Date())
    });
    return () => {
        socket.disconnect()
        socket.off("leaderboard_update")
    }
  }, [api]);

  const formatTimeSince = (date: Date | null) => {
    if (!date) return "-"

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
    }   
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchInitData()
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  return (
    <div className="h-full flex flex-col text-sm">
      {/* Toolbar */}
      <div className="bg-linear-to-b from-[#fafafa] to-[#f0f0f0] border-b border-[#d0d0d0] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span className="font-semibold text-gray-800">Real-time Leaderboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated: {lastUpdate.toLocaleTimeString("id-ID")}
          </span>
          <button onClick={handleRefresh} className="win-btn flex items-center gap-1">
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-linear-to-b from-[#e8e8e8] to-[#d8d8d8] border-b border-[#c0c0c0] px-3 py-2 grid grid-cols-[60px_1fr_100px_80px_120px] gap-2 text-xs font-semibold text-gray-700">
        <div>Rank</div>
        <div>Team</div>
        <div className="text-center">Score</div>
        <div className="text-center">Solves</div>
        <div className="text-center">Last Solve</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`px-3 py-2.5 grid grid-cols-[60px_1fr_100px_80px_120px] gap-2 items-center border-b border-[#e0e0e0] ${
                index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"
            } hover:bg-[#e8f4fc]`}
            >
                <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${getRankStyle(team.rank)}`}>
                    {team.rank}
                    </span>
                    {team.rank <= 3 && (
                    <Medal
                        className={`w-4 h-4 ${
                        team.rank === 1 ? "text-yellow-500" : team.rank === 2 ? "text-gray-400" : "text-orange-500"
                        }`}
                    />
                    )}
                </div>

                <div className="font-medium text-gray-800 truncate">{team.username}</div>

                <div className="text-center font-bold text-blue-600">{team.score.toLocaleString()}</div>

                <div className="text-center font-medium text-gray-700">{team.solves}</div>

                <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {team.lastSolve ? formatTimeSince(team.lastSolve) : "—"}
                </div>
        </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="bg-[#f0f0f0] border-t border-[#d0d0d0] px-3 py-1 text-xs text-gray-600 flex items-center justify-between">
        <span>{teams.length} teams competing</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live updates active
        </span>
      </div>
    </div>
  )
}
