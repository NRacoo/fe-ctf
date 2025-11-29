"use client"

import { Terminal, Shield, Clock, Users, Trophy } from "lucide-react"

export default function AboutWindow() {
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#d0d0d0]">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
          <Terminal className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">CyberAcademy CTF</h1>
          <p className="text-sm text-gray-500">Capture The Flag Test</p>
          <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gradient-to-br from-[#e8f4fc] to-[#d0e8f8] p-3 rounded border border-[#b0d4f0]">
          <Users className="w-5 h-5 text-blue-600 mb-1" />
          <div className="text-lg font-bold text-gray-800">156</div>
          <div className="text-xs text-gray-500">Teams</div>
        </div>
        <div className="bg-gradient-to-br from-[#e8f8e8] to-[#d0f0d0] p-3 rounded border border-[#b0e0b0]">
          <Shield className="w-5 h-5 text-green-600 mb-1" />
          <div className="text-lg font-bold text-gray-800">24</div>
          <div className="text-xs text-gray-500">Challenges</div>
        </div>
        <div className="bg-gradient-to-br from-[#fff8e8] to-[#f8f0d0] p-3 rounded border border-[#e8e0b0]">
          <Trophy className="w-5 h-5 text-yellow-600 mb-1" />
          <div className="text-lg font-bold text-gray-800">$5K</div>
          <div className="text-xs text-gray-500">Prize Pool</div>
        </div>
      </div>

      {/* Event Info */}
      <div className="bg-white border border-[#d0d0d0] rounded mb-4">
        <div className="bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] px-3 py-2 border-b border-[#d0d0d0]">
          <h3 className="font-semibold text-gray-700 text-sm">Event Details</h3>
        </div>
        <div className="p-3 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Duration: 48 Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Categories: Web, Crypto, Pwn, Reverse, Forensics, Misc</span>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white border border-[#d0d0d0] rounded flex-1">
        <div className="bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] px-3 py-2 border-b border-[#d0d0d0]">
          <h3 className="font-semibold text-gray-700 text-sm">Rules</h3>
        </div>
        <div className="p-3 text-xs text-gray-600 space-y-1">
          <p>• No attacking other teams or infrastructure</p>
          <p>• No sharing flags with other teams</p>
          <p>• No brute-forcing the flag submission</p>
          <p>• Have fun and learn!</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[#d0d0d0] text-center">
        <p className="text-xs text-gray-400">
          © 2025 CyberAcademy CTF
        </p>
      </div>
    </div>
  )
}
