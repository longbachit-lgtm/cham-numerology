import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { signup, login } from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = isSignup
        ? await signup({ email, password })
        : await login({ email, password });
      const { token, user } = res.data; // giả định API trả về như vậy
      setAuth(token, user);
      navigate("/onboarding/name");
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.error ||
        (err as Error)?.message ||
        "Đã xảy ra lỗi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => navigate("/onboarding/name");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6e7d3] to-[#faefde] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e9dccb] bg-white/90 shadow-xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-wide text-[#5a4639] mb-1">
            CHAM
          </h1>
          <p className="text-sm text-gray-600">Numerology &amp; Daily Guidance</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-[15px] placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
              placeholder="email@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-[15px] placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
              placeholder="••••••••"
              required
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <div className="text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#c79a4b] text-white font-semibold shadow-md hover:brightness-105 active:translate-y-px transition disabled:opacity-60"
          >
            {loading ? "Processing..." : isSignup ? "Sign up" : "Sign in"}
          </button>
        </form>

        {/* Switch login/signup */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignup((v) => !v)}
            className="text-[#2b7fff] hover:underline text-sm"
          >
            {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Skip */}
        <div className="mt-4">
          <button
            onClick={handleSkip}
            className="w-full h-11 rounded-xl border border-[#d9c7b5] bg-white text-[#6e645b] hover:bg-[#fff1e2] transition"
          >
            Skip sign in
          </button>
        </div>
      </div>
    </div>
  );
}
