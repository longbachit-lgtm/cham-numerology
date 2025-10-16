import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Gender = "male" | "female" | "other";

export default function OnboardingDOBPage() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidDate = (d: string, m: string, y: string) => {
    const dd = parseInt(d, 10);
    const mm = parseInt(m, 10);
    const yy = parseInt(y, 10);
    if (!dd || !mm || !yy) return false;
    if (yy < 1900 || yy > 2100) return false;
    const dt = new Date(yy, mm - 1, dd);
    return (
      dt.getFullYear() === yy &&
      dt.getMonth() === mm - 1 &&
      dt.getDate() === dd
    );
  };

  const handleNext = () => {
    setError("");
    if (!day || !month || !year) return;

    if (!isValidDate(day, month, year)) {
      setError("Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    const dob = `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    sessionStorage.setItem("onboarding_dob", dob);
    sessionStorage.setItem("onboarding_gender", gender);
    navigate("/onboarding/job");
  };

  const handleBack = () => navigate("/onboarding/name");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6e7d3] to-[#faefde] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e9dccb] bg-white/90 shadow-xl p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Bước 2/4</span>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-[#c79a4b] rounded" />
              <div className="w-12 h-1 bg-[#c79a4b] rounded" />
              <div className="w-12 h-1 bg-gray-300 rounded" />
              <div className="w-12 h-1 bg-gray-300 rounded" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ngày sinh của bạn?
          </h2>
          <p className="text-gray-600">
            Ngày sinh là yếu tố quan trọng nhất trong thần số học.
          </p>
        </div>

        <div className="space-y-6">
          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                value={day}
                onChange={(e) => setDay(e.target.value.slice(0, 2))}
                className="h-12 w-full rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-[16px] placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
                placeholder="Ngày"
                min={1}
                max={31}
              />
              <input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value.slice(0, 2))}
                className="h-12 w-full rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-[16px] placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
                placeholder="Tháng"
                min={1}
                max={12}
              />
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value.slice(0, 4))}
                className="h-12 w-full rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-[16px] placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
                placeholder="Năm"
                min={1900}
                max={2100}
              />
            </div>
            {error && (
              <div className="mt-2 text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                  gender === "male"
                    ? "border-[#c79a4b] bg-[#fff1e2] text-[#6b4f2b]"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                  gender === "female"
                    ? "border-[#c79a4b] bg-[#fff1e2] text-[#6b4f2b]"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                Nữ
              </button>
              <button
                type="button"
                onClick={() => setGender("other")}
                className={`flex-1 h-12 rounded-xl border-2 transition-all ${
                  gender === "other"
                    ? "border-[#c79a4b] bg-[#fff1e2] text-[#6b4f2b]"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                Khác
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 h-12 rounded-xl border border-[#d9c7b5] bg-white text-[#6e645b] hover:bg-[#fff1e2] transition"
            >
              Quay lại
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!day || !month || !year}
              className="flex-1 h-12 rounded-xl bg-[#c79a4b] text-white font-semibold shadow-md hover:brightness-105 active:translate-y-px transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
