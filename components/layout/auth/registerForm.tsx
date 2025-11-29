"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import React from "react";

interface RegisterFormProps {
  username: string;
  password: string;
  isLoading: boolean;
  error: string;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onRegister: () => void;
  onBack: () => void;
  onSwitch: () => void;
}

export default function RegisterForm({
  username,
  password,
  isLoading,
  error,
  onUsernameChange,
  onPasswordChange,
  onKeyDown,
  onRegister,
  onBack,
  onSwitch,
}: RegisterFormProps) {
  return (
    <div className="w-80 flex flex-col gap-3">
      {/* Username */}
      <div className="relative">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full px-4 py-3 bg-black/30 border border-white/30 text-white"
        />
      </div>

      {/* Password */}
      <div className="relative flex">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 px-4 py-3 bg-black/30 border border-white/30 text-white"
        />

        <button
          onClick={onRegister}
          disabled={isLoading}
          className="px-4 bg-black/30 border border-white/30 border-l-0 text-white"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {/* Footer */}
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={onBack} className="text-white/60 text-sm hover:text-white">
          Back to users
        </button>
        <span className="text-white/30">|</span>
        <button onClick={onSwitch} className="text-white/60 text-sm hover:text-white">
          Sign in
        </button>
      </div>
    </div>
  );
}
