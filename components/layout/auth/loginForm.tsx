"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import React from "react";

interface LoginFormProps {
  username: string;
  password: string;
  isLoading: boolean;
  error: string;
  onUserChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onLogin: () => void;
  onBack: () => void;
  onSwitch: () => void;
}

export default function LoginForm({
  username,
  password,
  isLoading,
  error,
  onUserChange,
  onPasswordChange,
  onKeyDown,
  onLogin,
  onBack,
  onSwitch,
}: LoginFormProps) {
  return (
    <div className="w-80 flex flex-col gap-3">
      <div className="relative">
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => onUserChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full px-4 py-3 bg-black/30 border border-white/30 text-white placeholder-white/50"
        />
      </div>

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
          onClick={onLogin}
          disabled={isLoading}
          className="px-4 bg-black/30 border border-white/30 border-l-0 text-white"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <p className="text-white/60 text-sm text-center mt-2">
        Sign in to: <span className="text-white/80">CTFCA</span>
      </p>

      {/* Footer */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={onBack}
          className="text-white/60 text-sm hover:text-white transition-colors"
        >
          Back to users
        </button>
        <span className="text-white/30">|</span>
        <button
          onClick={onSwitch}
          className="text-white/60 text-sm hover:text-white transition-colors"
        >
          Create account
        </button>
      </div>
    </div>
  );
}
