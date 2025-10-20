import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function OnboardingNamePage() {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    const name = fullName.trim();
    if (!name) return;
    sessionStorage.setItem("onboarding_name", name);
    navigate("/onboarding/dob");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      // nền hoạ tiết nhẹ như mock
      style={{
        backgroundImage:
          "radial-gradient(#f3d9a6 1px, transparent 1px), radial-gradient(#f3d9a6 1px, transparent 1px)",
        backgroundPosition: "0 0, 12px 12px",
        backgroundSize: "24px 24px",
        backgroundColor: "#fff8ec",
      }}
    >
      {/* Dots progress */}
      <div className="mb-3 flex items-center gap-2">
        {/* dot active lớn hơn và có viền */}
        <span className="w-4 h-4 rounded-full bg-[#c79a4b] ring-2 ring-[#f2e2c8]" />
        {/* các dot còn lại nhạt hơn */}
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-[18px] border border-[#c8b8a2] bg-[#fff4e6]/95 shadow-[0_10px_30px_rgba(60,40,20,.08)] p-6">
        {/* Title */}
        <h2 className="text-center text-[22px] font-extrabold tracking-wide text-[#c79a4b] mb-4">
          Họ Và Tên
        </h2>

        {/* Input big like mock */}
        <div className="mb-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNext()}
            placeholder=""
            className="h-[92px] w-full rounded-[16px] border-2 border-[#d7a760] bg-white/95 px-4 text-[18px] text-[#6b5a4b] placeholder:text-[#d8c7b6] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
            autoFocus
          />
        </div>

        {/* Quote */}
        <p className="text-center text-[13px] text-[#9a744a] italic mb-4">
          “Tên bạn không chỉ là âm thanh — đó là nhịp điệu mà vũ trụ gọi bạn mỗi ngày.”
        </p>

        {/* Arrow button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={!fullName.trim()}
            className="group inline-flex items-center justify-center w-[120px] h-[52px] rounded-full bg-[#c79a4b] text-white shadow-sm hover:brightness-105 active:translate-y-px transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Tiếp tục"
            title="Tiếp tục"
          >
            <ArrowRight className="w-7 h-7 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Logo dưới (tuỳ chọn giống mock) */}
      <div className="mt-4 text-[#5a4639] font-extrabold tracking-wide text-lg">
        Chạm.
      </div>
    </div>
  );
}
