"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Save, X, Flag, AlertTriangle, CheckCircle } from "lucide-react"
import { useChallenges, type Challenge } from "../../lib/challenge-context"


interface EditingChallenge {
  id?: string
  title: string
  description: string
  points: number
  flag: string
}

const emptyChallenge: EditingChallenge = {
  title: "",
  description: "",
  points: 100,
  flag: "",
}

export default function AdminWindow() {
  const { challenges, createChallenge, deleteChallenge } = useChallenges()
  const [editingChallenge, setEditingChallenge] = useState<EditingChallenge | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingChallenge(emptyChallenge)
  }

  const handleEdit = (challenge: Challenge) => {
    setIsCreating(false)
    setEditingChallenge({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      points: challenge.points,
      flag: challenge.flag,
    })
  }

  const handleSave = () => {
    if (!editingChallenge) return
    if (!editingChallenge.title || !editingChallenge.flag) {
      return
    }

    if (isCreating) {
      createChallenge({
        title: editingChallenge.title,
        description: editingChallenge.description,
        points: editingChallenge.points,
        flag: editingChallenge.flag,
      })
      showSuccess("Challenge created successfully!")
    }
    setEditingChallenge(null)
    setIsCreating(false)
  }

  const handleDelete = (id: string) => {
    deleteChallenge(id)
    setConfirmDelete(null)
    showSuccess("Challenge deleted successfully!")
  }

  return (
    <div className="h-full flex flex-col text-sm">
      {/* Toolbar */}
      <div className="bg-linear-to-b from-[#f8f8f8] to-[#e8e8e8] border-b border-[#c0c0c0] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Challenge Manager</span>
          <span className="text-xs text-gray-500">({challenges.length} challenges)</span>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 px-3 py-1.5 bg-linear-to-b from-[#5cb85c] to-[#449d44] text-white text-xs rounded border border-[#4cae4c] hover:from-[#6cc76c] hover:to-[#54ad54]"
        >
          <Plus className="w-3 h-3" />
          New Challenge
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border-b border-green-200 px-3 py-2 flex items-center gap-2 text-green-700 text-xs">
          <CheckCircle className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Challenge list */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#f0f0f0] sticky top-0">
              <tr className="text-left text-xs text-gray-600 border-b border-[#d0d0d0]">
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Points</th>
                <th className="px-3 py-2 font-semibold">Solves</th>
                <th className="px-3 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => (
                <tr
                  key={challenge.id}
                  className={`border-b border-[#e8e8e8] hover:bg-[#f5f5f5] ${
                    editingChallenge?.id === challenge.id ? "bg-[#e6f3ff]" : ""
                  }`}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-800">{challenge.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-semibold text-blue-600">{challenge.points}</td>
                  <td className="px-3 py-2 text-gray-500">{challenge.solves}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(challenge)}
                        className="p-1.5 hover:bg-blue-100 rounded text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(challenge.id)}
                        className="p-1.5 hover:bg-red-100 rounded text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit panel */}
        {editingChallenge && (
          <div className="w-80 border-l border-[#d0d0d0] bg-white flex flex-col">
            <div className="bg-linear-to-b from-[#f8f8f8] to-[#e8e8e8] border-b border-[#c0c0c0] px-3 py-2 flex items-center justify-between">
              <span className="font-semibold text-gray-700">{isCreating ? "New Challenge" : "Edit Challenge"}</span>
              <button onClick={() => setEditingChallenge(null)} className="p-1 hover:bg-black/10 rounded">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                <input
                  type="text"
                  value={editingChallenge.title}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, title: e.target.value })}
                  className="w-full px-2 py-1.5 border border-[#a0a0a0] focus:border-[#3c7fb1] focus:outline-none text-sm"
                  placeholder="Challenge name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Points</label>
                <input
                  type="number"
                  value={editingChallenge.points}
                  onChange={(e) =>
                    setEditingChallenge({ ...editingChallenge, points: Number.parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-2 py-1.5 border border-[#a0a0a0] focus:border-[#3c7fb1] focus:outline-none text-sm"
                  min={0}
                  step={50}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  value={editingChallenge.description}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, description: e.target.value })}
                  className="w-full px-2 py-1.5 border border-[#a0a0a0] focus:border-[#3c7fb1] focus:outline-none text-sm resize-none"
                  rows={4}
                  placeholder="Challenge description..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Flag *</label>
                <input
                  type="text"
                  value={editingChallenge.flag}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, flag: e.target.value })}
                  className="w-full px-2 py-1.5 border border-[#a0a0a0] focus:border-[#3c7fb1] focus:outline-none text-sm font-mono"
                  placeholder="CPS{...}"
                />
              </div>
            </div>
            <div className="p-3 border-t border-[#e0e0e0] flex gap-2">
              <button
                onClick={() => setEditingChallenge(null)}
                className="flex-1 px-3 py-1.5 bg-[#f0f0f0] border border-[#c0c0c0] text-gray-700 text-xs rounded hover:bg-[#e0e0e0]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editingChallenge.title || !editingChallenge.flag}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-linear-to-b from-[#3c7fb1] to-[#2a5f91] text-white text-xs rounded border border-[#2a5f91] hover:from-[#4c8fc1] hover:to-[#3a6fa1] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-3 h-3" />
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {confirmDelete !== null && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-[#f0f0f0] border border-[#888] shadow-xl w-80">
            <div className="bg-linear-to-b from-[#4a90c2] to-[#2a5f91] px-3 py-2 text-white text-sm font-semibold">
              Confirm Delete
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-500 shrink-0" />
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete this challenge? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-1.5 bg-[#e0e0e0] border border-[#a0a0a0] text-gray-700 text-xs rounded hover:bg-[#d0d0d0]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-1.5 bg-linear-to-b from-[#d9534f] to-[#c9302c] text-white text-xs rounded border border-[#c9302c] hover:from-[#e95450] hover:to-[#d9403c]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
