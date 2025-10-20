import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { signup, login } from "../services/api";

export default function LoginCardLikeMock() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const { token, user } = res.data; // tuỳ API của bạn
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

  const handleSkip = () => {
    // Bỏ qua đăng nhập -> vào luồng onboarding
    navigate("/onboarding/name");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "radial-gradient(#f3d9a6 1px, transparent 1px), radial-gradient(#f3d9a6 1px, transparent 1px)",
        backgroundPosition: "0 0, 12px 12px",
        backgroundSize: "24px 24px",
        backgroundColor: "#fff8ec",
      }}
    >
      <div className="w-full max-w-md rounded-[18px] border border-[#c8b8a2] bg-[#fff4e6]/95 shadow-[0_10px_30px_rgba(60,40,20,.08)] p-6">
        <h2 className="text-center text-[28px] font-extrabold tracking-wide text-[#c79a4b] mb-6">
          {isSignup ? "ĐĂNG KÝ" : "ĐĂNG NHẬP"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-[54px] w-full rounded-[16px] border-2 border-[#d7a760] bg-white/95 px-4 text-[16px] text-[#6b5a4b] placeholder:text-[#d8c7b6] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="h-[54px] w-full rounded-[16px] border-2 border-[#d7a760] bg-white/95 px-4 text-[16px] text-[#6b5a4b] placeholder:text-[#d8c7b6] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
              required
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <div className="text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex items-center justify-center w-[132px] h-[58px] rounded-full bg-[#c79a4b] shadow-sm hover:brightness-105 active:translate-y-px transition disabled:opacity-60"
              aria-label={isSignup ? "Đăng ký" : "Đăng nhập"}
              title={isSignup ? "Đăng ký" : "Đăng nhập"}
            >
              <ArrowRight className="w-8 h-8 text-white transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </form>

        {/* Liên kết dưới cùng */}
        <div className="mt-5 text-center text-[16px]">
          <button
            type="button"
            className="text-[#1d76ff] font-medium hover:underline"
            onClick={() => setIsSignup((v) => !v)}
          >
            {isSignup ? "Đăng nhập." : "Đăng kí."}
          </button>
          <button
            type="button"
            className="ml-2 text-[#9a8f83] underline-offset-2 hover:underline"
            onClick={handleSkip}
          >
            Bỏ qua bước đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
