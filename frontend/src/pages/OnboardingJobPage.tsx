import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingJobPage() {
  const [jobField, setJobField] = useState("");
  const [jobRole, setJobRole] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    sessionStorage.setItem("onboarding_jobField", jobField.trim());
    sessionStorage.setItem("onboarding_jobRole", jobRole.trim());
    navigate("/onboarding/complete");
  };

  const handleBack = () => navigate("/onboarding/dob");
  const handleSkip = () => navigate("/onboarding/complete");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6e7d3] to-[#faefde] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e9dccb] bg-white/90 shadow-xl p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Bước 3/4</span>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-[#c79a4b] rounded" />
              <div className="w-12 h-1 bg-[#c79a4b] rounded" />
              <div className="w-12 h-1 bg-[#c79a4b] rounded" />
              <div className="w-12 h-1 bg-gray-300 rounded" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Công việc của bạn?
          </h2>
          <p className="text-gray-600">
            Giúp chúng tôi cá nhân hoá lời khuyên phù hợp với công việc của bạn.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lĩnh vực (tuỳ chọn)
            </label>
            <input
              type="text"
              value={jobField}
              onChange={(e) => setJobField(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              className="h-12 w-full rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-[16px] placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
              placeholder="Công nghệ, Giáo dục, Kinh doanh..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò (tuỳ chọn)
            </label>
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              className="h-12 w-full rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-[16px] placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
              placeholder="Lập trình viên, Giáo viên, Quản lý..."
            />
          </div>

          <div className="bg-[#f9fafb] p-4 rounded-xl border border-[#e5e7eb]">
            <p className="text-sm text-gray-600">
              💡 Thông tin này giúp chúng tôi đưa ra lời khuyên sát bối cảnh công việc của bạn.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="h-12 px-4 rounded-xl border border-[#d9c7b5] bg-white text-[#6e645b] hover:bg-[#fff1e2] transition"
            >
              Quay lại
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 h-12 rounded-xl border border-[#d9c7b5] bg-white text-[#6e645b] hover:bg-[#fff1e2] transition"
            >
              Bỏ qua
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 h-12 rounded-xl bg-[#c79a4b] text-white font-semibold shadow-md hover:brightness-105 active:translate-y-px transition"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}