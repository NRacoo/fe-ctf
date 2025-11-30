"use client"

import { useState } from "react"
import { Flag, CheckCircle, ChevronRight, Search, Filter } from "lucide-react"
import { useChallenges } from "../../lib/challenge-context"

export default function ChallengesWindow() {
  const { challenges, submitFlag } = useChallenges()
  const [flagInput, setFlagInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [submit, setSubmit] = useState<"correct" | "wrong" | null>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<(typeof challenges)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleSelect = (challenge : any) =>{
    setSelectedChallenge(challenge)
    setFlagInput("")
    setSubmit(null)
  }

  const handleSubmitFlag = async () => {
    if(!selectedChallenge) return
    if(!flagInput.trim())return

    setLoading(true)
    setSubmit(null)

    const ok = await submitFlag(selectedChallenge.id, flagInput)
    if(ok){
      selectedChallenge.solved = true
    }
    setSubmit(ok ? "correct" : "wrong")
    setLoading(false)
  }

  return (
    <div className="h-full flex text-sm">
      {/* Challenge List */}
      <div className="flex-1 flex flex-col">
        <div className="bg-linear-to-b from-[#e8e8e8] to-[#d8d8d8] border-b border-[#c0c0c0] px-3 py-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">{filteredChallenges.length} Challenges</span>
          <span className="text-xs text-gray-500">
            {challenges.filter((c) => c.solved).length}/{challenges.length} Solved
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChallenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => handleSelect(challenge)}
              className={`w-full px-3 py-3 border-b border-[#e0e0e0] flex items-center gap-3 text-left transition-colors ${
                selectedChallenge?.id === challenge.id ? "bg-[#cce8ff]" : "hover:bg-[#f5f5f5]"
              }`}
            >
              {challenge.solved ? (
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0"/>
              ) : (
                <Flag className="w-5 h-5 text-gray-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">{challenge.title}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">{challenge.points}</div>
                <div className="text-[10px] text-gray-400">pts</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Detail */}
      {selectedChallenge && (
        <div className="w-64 bg-white border-l border-[#d0d0d0] flex flex-col">
          <div className="p-3 border-b border-[#e0e0e0]">
            <h3 className="font-semibold text-gray-800">{selectedChallenge.title}</h3>
            <div className="text-2xl font-bold text-blue-600 mt-1">{selectedChallenge.points} pts</div>
          </div>
          <div className="p-3 flex-1">
            <p className="text-xs text-gray-600">{selectedChallenge.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              <span className="font-semibold">{selectedChallenge.solves}</span> solved
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Flag *</label>
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  disabled = {selectedChallenge.solved}
                  className="w-full px-2 py-1.5 border border-[#a0a0a0] focus:border-[#3c7fb1] focus:outline-none text-sm font-mono"
                  placeholder="CPS{...}"
                />
                {selectedChallenge.solved && (
                  <p className="text-green-600 w-full px-2 py-1.5 border border-[#a0a0a0] text-xs mt-1">✔ Challenge sudah disolve!</p>
                )}

              {submit === "correct" && (
                <p className="text-green-600 text-xs mt-1">✔ Flag Correct!</p>
              )}
              {submit === "wrong" && (
                <p className="text-red-500 text-xs mt-1">✖ Wrong Flag</p>
              )}
              </div>
          <div className="p-3 border-t border-[#e0e0e0]">
            <button
              onClick={handleSubmitFlag}
              disabled={loading || selectedChallenge.solved} 
              className={`w-full px-3 py-1.5 text-white text-xs rounded border flex items-center justify-center gap-2
                ${selectedChallenge.solved 
                  ? "bg-gray-400 border-gray-400 cursor-not-allowed" 
                  : "bg-linear-to-b from-[#3c7fb1] to-[#2a5f91] border-[#2a5f91] hover:from-[#4c8fc1] hover:to-[#3a6fa1]"
                }`}
            >
              <Flag className="w-3 h-3" />
              {selectedChallenge.solved ? "Solved" : loading ? "Checking..." : "Submit Flag"}
            </button>

          </div>
        </div>
      )}
    </div>
  )
}
