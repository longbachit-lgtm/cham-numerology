import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingNamePage() {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    const name = fullName.trim();
    if (name) {
      sessionStorage.setItem("onboarding_name", name);
      navigate("/onboarding/dob");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6e7d3] to-[#faefde] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e9dccb] bg-white/90 shadow-xl p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Bước 1/4</span>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-[#c79a4b] rounded" />
              <div className="w-12 h-1 bg-gray-300 rounded" />
              <div className="w-12 h-1 bg-gray-300 rounded" />
              <div className="w-12 h-1 bg-gray-300 rounded" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Xin chào! Bạn tên là gì?
          </h2>
          <p className="text-gray-600">
            Hãy cho chúng tôi biết họ và tên đầy đủ của bạn để tính toán chính
            xác nhất.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và Tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              className="h-12 w-full rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-lg placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
              placeholder="Nguyễn Văn A"
              autoFocus
            />
          </div>

          <div className="bg-[#fff1e2] p-4 rounded-xl border border-[#ead8c6]">
            <p className="text-sm text-[#6b4f2b] italic">
              “Mỗi con người là một vũ trụ thu nhỏ, và tên của bạn là chìa khóa
              để mở ra những bí mật ấy.”
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={!fullName.trim()}
            className="w-full h-12 rounded-xl bg-[#c79a4b] text-white text-lg font-semibold shadow-md hover:brightness-105 active:translate-y-px transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}
