"use client"

import type React from "react"

import { useRef, useState, type ReactNode } from "react"
import { X, Minus, Square } from "lucide-react"

interface WindowFrameProps {
  title: string
  children: ReactNode
  isActive: boolean
  isMinimize: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  onUpdatePosition: (position: { x: number; y: number }) => void
}

export default function WindowFrame({
  title,
  children,
  isActive,
  isMinimize,
  position,
  size,
  zIndex,
  onClose,
  onMinimize,
  onFocus,
  onUpdatePosition,
}: WindowFrameProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement) return
    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    onFocus()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    onUpdatePosition({
      x: Math.max(0, e.clientX - dragOffset.current.x),
      y: Math.max(0, e.clientY - dragOffset.current.y),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      className="fixed select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        zIndex,
        display: isMinimize ? "none" : "block"
      }}
      onMouseDown={onFocus}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Window shadow */}
      <div className="absolute inset-0 shadow-2xl rounded-t" />

      {/* Window border */}
      <div
        className={`relative border rounded-t overflow-hidden ${isActive ? "border-[#3d7bad]" : "border-[#888888]"}`}
      >
        {/* Title bar */}
        <div
          className={`h-8 flex items-center justify-between px-2 cursor-move ${
            isActive
              ? "bg-linear-to-b from-[#4a90c2] via-[#2d6da3] to-[#1e5a8e]"
              : "bg-linear-to-b from-[#b8b8b8] via-[#a0a0a0] to-[#888888]"
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/20 rounded-sm flex items-center justify-center">
              <Square className="w-2.5 h-2.5 text-white" />
            </div>
            <span className={`text-sm font-normal ${isActive ? "text-white" : "text-gray-700"}`}>{title}</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={onMinimize}
              className="w-7 h-6 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Minus className={`w-3 h-3 ${isActive ? "text-white" : "text-gray-600"}`} />
            </button>
            <button className="w-7 h-6 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Square className={`w-2.5 h-2.5 ${isActive ? "text-white" : "text-gray-600"}`} />
            </button>
            <button
              onClick={onClose}
              className="w-11 h-6 flex items-center justify-center bg-[#c42b1c] hover:bg-[#e04035] transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Window content */}
        <div className="bg-[#f0f0f0] border-t border-[#dfdfdf]" style={{ height: size.height }}>
          {children}
        </div>
      </div>
    </div>
  )
}
